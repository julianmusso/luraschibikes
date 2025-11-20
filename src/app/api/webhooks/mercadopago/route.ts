import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateProductsStock } from '@/core/server.updateProductsStock';
import { getCartProducts } from '@/core/server.getCartProducts';
import { client } from '@/sanity/lib/client';
import { sendPaymentConfirmedEmail } from '@/core/email.paymentConfirmed';
import { sendPaymentRefundedEmail } from '@/core/email.paymentRefunded';

type CartItem = {
  id: string;
  quantity: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
};

export async function POST(request: NextRequest) {
  try {
    // 1. Validar firma HMAC (opcional - solo en producción con secret configurado)
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');
    const url = new URL(request.url);
    const dataId = url.searchParams.get('data.id');

    // Solo validar firma si está configurado el secret (producción)
    if (process.env.MERCADOPAGO_WEBHOOK_SECRET && xSignature && xRequestId && dataId) {
      const isValid = validateSignature(xSignature, xRequestId, dataId);
      if (!isValid) {
        console.error('❌ Firma inválida');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
      console.log('✅ Firma HMAC válida');
    } else if (!process.env.MERCADOPAGO_WEBHOOK_SECRET) {
      console.log('⚠️  WEBHOOK_SECRET no configurado, aceptando webhooks sin validación (modo desarrollo)');
    }

    // 2. Leer body
    const body = await request.json();
    console.log('>>> 📨 [MP Webhook]', body.type, 'ID:', body.data?.id, 'Live:', body.live_mode);

    // 3. Responder INMEDIATAMENTE 200 (antes de 22 segundos)
    // Procesar en segundo plano sin bloquear la respuesta
    if (body.type === 'payment') {
      processPaymentNotification(body.data.id).catch(err => 
        console.error('Error procesando pago:', err)
      );
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('[Webhook Error]:', error);
    return NextResponse.json({ received: true });
  }
}

// Procesa el pago en segundo plano
async function processPaymentNotification(paymentId: string) {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Error obteniendo pago:', response.status);
      return;
    }

    const payment = await response.json();
    console.log(`Pago ${paymentId}: ${payment.status}`);

    // Solo procesar pagos aprobados
    if (payment.status !== 'approved') {
      console.log(`⏳ Pago ${payment.status}, esperando aprobación`);
      return;
    }

    // Extraer metadata
    const metadata = payment.metadata;
    
    // Si no hay metadata, es una prueba desde el panel de MercadoPago
    if (!metadata || !metadata.order_number) {
      console.log('🧪 WEBHOOK DE PRUEBA - Sin metadata de orden');
      console.log('Payment ID:', paymentId);
      console.log('Status:', payment.status);
      console.log('Amount:', payment.transaction_amount);
      console.log('Payer:', payment.payer);
      console.log('✅ Webhook test recibido correctamente (sin procesar orden)');
      return;
    }

    const cartItems: CartItem[] = JSON.parse(metadata.cart_items);

    // Validación final de stock
    const productIds = cartItems.map((item) => item.id);
    const products: Product[] = await getCartProducts(productIds);

    const stockCheck = cartItems.every((item) => {
      const product = products.find((p: Product) => p.id === item.id);
      return product && product.stock >= item.quantity;
    });

    if (!stockCheck) {
      // Stock insuficiente → Refund
      console.error('❌ Stock insuficiente, procesando refund...');
      
      await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      // Enviar email notificando refund
      await sendPaymentRefundedEmail(
        {
          email: metadata.customer_email,
          nombre: metadata.customer_name
        },
        {
          orderNumber: metadata.order_number,
          orderUrl: `${process.env.NEXT_PUBLIC_URL}/pedido/${metadata.order_number}`,
          customerName: metadata.customer_name,
          amount: payment.transaction_amount,
          reason: 'No pudimos procesar tu pedido porque uno o más productos se quedaron sin stock después de la compra. Disculpá las molestias.'
        }
      );
      
      console.log('💸 Refund procesado por stock insuficiente + email enviado');
      return;
    }

    // Actualizar orden en Sanity (de pending a paid)
    const orderNumber = metadata.order_number;
    
    if (!orderNumber) {
      console.error('❌ No se encontró order_number en metadata');
      return;
    }

    // Buscar orden por orderNumber
    const existingOrder = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );

    if (!existingOrder) {
      console.error(`❌ No se encontró la orden: ${orderNumber}`);
      return;
    }

    // Actualizar orden a status='paid' y agregar info de pago
    await client
      .patch(existingOrder._id)
      .set({
        status: 'paid',
        paidAt: new Date().toISOString(),
        'payment.mercadopagoId': payment.id.toString(),
        'payment.status': payment.status,
        'payment.transactionAmount': payment.transaction_amount
      })
      .commit();

    console.log(`✅ Orden actualizada a PAID: ${orderNumber}`);

    // Actualizar stock
    await updateProductsStock(
      cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }))
    );

    console.log(`✅ Stock actualizado correctamente`);

    // Enviar email de confirmación de pago
    const productsWithQuantity = cartItems.map((item) => {
      const product = products.find((p: Product) => p.id === item.id);
      return {
        name: product?.name || 'Producto',
        quantity: item.quantity,
        price: product?.price || 0
      };
    });

    const total = productsWithQuantity.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const shippingAddress = `${metadata.shipping_address}, ${metadata.shipping_city}, ${metadata.shipping_province} (${metadata.shipping_zipcode})`;

    await sendPaymentConfirmedEmail(
      {
        email: metadata.customer_email,
        nombre: metadata.customer_name
      },
      {
        orderNumber: metadata.order_number,
        orderUrl: `${process.env.NEXT_PUBLIC_URL}/pedido/${metadata.order_number}`,
        customerName: metadata.customer_name,
        items: productsWithQuantity,
        total,
        shippingAddress
      }
    );

    console.log(`✅ Email de confirmación enviado a ${metadata.customer_email}`);

  } catch (error) {
    console.error('Error en processPaymentNotification:', error);
  }
}

function validateSignature(xSignature: string, xRequestId: string, dataId: string): boolean {
  try {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret) return false;

    // Extraer ts y v1 de x-signature
    const parts = xSignature.split(',');
    let ts = '';
    let hash = '';

    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key?.trim() === 'ts') ts = value?.trim() || '';
      if (key?.trim() === 'v1') hash = value?.trim() || '';
    });

    if (!ts || !hash) return false;

    // Crear manifest según documentación MP
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    // Generar HMAC SHA256
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    return generatedHash === hash;
  } catch {
    return false;
  }
}