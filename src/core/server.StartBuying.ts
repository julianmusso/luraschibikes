'use server'

import { getCartProducts } from './server.getCartProducts';
import { createOrder } from './server.createOrder';
import MercadoPagoConfig, { Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

type CartItem = {
  id: string;
  quantity: number;
};

type CartProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
};

type BuyingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  address: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  zipCode: string;
};

export async function StartBuying(
  cart: CartItem[], 
  customerData: BuyingFormData,
  paymentMethod: 'mercadopago' | 'transferencia' | 'efectivo' = 'mercadopago'
) {
  try {
    console.log('\n========================================')
    console.log('🛒 INICIO DE PROCESO DE COMPRA');
    console.log('========================================');
    console.log('📦 Carrito recibido:', JSON.stringify(cart, null, 2));
    console.log('👤 Datos del cliente:', JSON.stringify(customerData, null, 2));
    console.log('💳 Método de pago:', paymentMethod);
    
    // 1. Validación final de stock
    const products = await getCartProducts(cart.map(item => item.id));
    console.log('\n✅ Productos obtenidos de Sanity:', products.length, 'items');
    
    const stockIssues = cart
      .map(item => {
        const product = products.find((p: CartProduct) => p.id === item.id);
        if (!product) return { productId: item.id, issue: 'not_found' };
        if (product.stock < item.quantity) {
          return {
            productId: item.id,
            productName: product.name,
            requested: item.quantity,
            available: product.stock,
            issue: 'insufficient_stock'
          };
        }
        return null;
      })
      .filter(Boolean);

    if (stockIssues.length > 0) {
      console.log('\n❌ STOCK INSUFICIENTE:');
      console.log(JSON.stringify(stockIssues, null, 2));
      return {
        success: false,
        error: 'insufficient_stock',
        issues: stockIssues
      };
    }
    
    console.log('\n✅ Stock validado correctamente - Todos los productos disponibles');

    // 2. Crear orden PENDIENTE antes de la preferencia de MercadoPago
    console.log('\n📝 Creando orden en Sanity...');
    const orderResult = await createOrder({
      status: 'pending',
      customer: {
        nombre: `${customerData.firstName} ${customerData.lastName}`,
        email: customerData.email,
        telefono: customerData.phone,
        dni: customerData.dni
      },
      items: cart.map(item => {
        const product = products.find((p: CartProduct) => p.id === item.id)!;
        return {
          productId: item.id,
          quantity: item.quantity,
          productSnapshot: {
            name: product.name,
            price: product.price,
            image: product.image
          }
        };
      }),
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      shipping: {
        direccion: customerData.address,
        numero: customerData.number,
        piso: customerData.floor,
        departamento: customerData.apartment,
        ciudad: customerData.city,
        provincia: customerData.province,
        codigoPostal: customerData.zipCode
      },
      totals: {
        subtotal: products.reduce((sum: number, p: CartProduct) => {
          const item = cart.find(i => i.id === p.id);
          return sum + (item ? p.price * item.quantity : 0);
        }, 0),
        shipping: 0,
        total: products.reduce((sum: number, p: CartProduct) => {
          const item = cart.find(i => i.id === p.id);
          return sum + (item ? p.price * item.quantity : 0);
        }, 0)
      }
    });

    if (!orderResult.success) {
      console.log('\n❌ ERROR creando orden en Sanity:', orderResult.error);
      return {
        success: false,
        error: 'order_creation_failed'
      };
    }

    const { orderNumber } = orderResult;
    console.log('\n✅ Orden creada exitosamente:');
    console.log('   Order ID:', orderResult.orderId);
    console.log('   Order Number:', orderNumber);

    // Si es pago offline (transferencia/efectivo), retornar sin crear preferencia de MercadoPago
    if (paymentMethod === 'transferencia' || paymentMethod === 'efectivo') {
      console.log('\n💰 Pago offline - No se requiere MercadoPago');
      console.log('========================================');
      console.log('✅ PROCESO COMPLETADO (PAGO OFFLINE)');
      console.log('========================================\n');
      
      return {
        success: true,
        orderNumber,
        paymentMethod
      };
    }

    // 3. Crear preferencia de MercadoPago (solo para pago online)
    console.log('\n💳 Creando preferencia de MercadoPago...');
    const preference = new Preference(client);
    
    const preferenceData = {
      items: products.map((product: CartProduct) => {
        const cartItem = cart.find(item => item.id === product.id)!;
        return {
          id: product.id,
          title: product.name,
          quantity: cartItem.quantity,
          unit_price: product.price,
          currency_id: 'ARS',
          picture_url: product.image
        };
      }),
      payer: {
        name: customerData.firstName,
        surname: customerData.lastName,
        email: customerData.email,
        phone: {
          number: customerData.phone
        },
        identification: customerData.dni ? {
          type: 'DNI',
          number: customerData.dni
        } : undefined
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/pedido/${orderNumber}`,
        failure: `${process.env.NEXT_PUBLIC_URL}/pedido/${orderNumber}`,
        pending: `${process.env.NEXT_PUBLIC_URL}/pedido/${orderNumber}`
      },
      auto_return: 'approved' as const,
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/mercadopago`,
      external_reference: orderNumber,
      metadata: {
        order_number: orderNumber,
        // Datos del carrito para el webhook
        cart_items: JSON.stringify(cart),
        // Datos del cliente
        customer_email: customerData.email,
        customer_name: `${customerData.firstName} ${customerData.lastName}`,
        customer_phone: customerData.phone,
        customer_dni: customerData.dni,
        // Datos de envío
        shipping_address: customerData.address,
        shipping_number: customerData.number,
        shipping_floor: customerData.floor || '',
        shipping_apartment: customerData.apartment || '',
        shipping_city: customerData.city,
        shipping_province: customerData.province,
        shipping_zipcode: customerData.zipCode
      }
    };

    const response = await preference.create({ body: preferenceData });
    
    console.log('\n✅ Preferencia de MercadoPago creada:');
    console.log('   Preference ID:', response.id);
    console.log('   Init Point:', response.init_point);
    console.log('\n📋 METADATA enviada a MercadoPago:');
    console.log(JSON.stringify(preferenceData.metadata, null, 2));
    console.log('\n📦 ITEMS enviados a MercadoPago:');
    console.log(JSON.stringify(preferenceData.items, null, 2));
    console.log('\n🔙 BACK URLs configuradas:');
    console.log(JSON.stringify(preferenceData.back_urls, null, 2));
    console.log('\n========================================');
    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE');
    console.log('========================================\n');

    return {
      success: true,
      init_point: response.init_point!,
      preference_id: response.id!,
      orderNumber,
      paymentMethod
    };

  } catch (error) {
    console.log('\n========================================');
    console.log('❌ ERROR EN PROCESO DE COMPRA');
    console.log('========================================');
    console.error('Error completo:', error);
    
    // Capturar errores específicos de MercadoPago
    let errorMessage = 'Error desconocido al procesar la compra';
    let errorCode = 'mercadopago_error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Errores comunes de MercadoPago
      if (error.message.includes('unauthorized')) {
        errorCode = 'mercadopago_unauthorized';
        errorMessage = 'Error de autenticación con MercadoPago. Contactá a soporte.';
      } else if (error.message.includes('invalid_token')) {
        errorCode = 'mercadopago_invalid_token';
        errorMessage = 'Token de MercadoPago inválido. Contactá a soporte.';
      } else if (error.message.includes('timeout')) {
        errorCode = 'mercadopago_timeout';
        errorMessage = 'MercadoPago no respondió a tiempo. Por favor, intentá nuevamente.';
      }
    }
    
    return {
      success: false,
      error: errorCode,
      message: errorMessage
    };
  }
}