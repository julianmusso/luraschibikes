'use server'

import { getCartProducts } from './server.getCartProducts';
import { createOrder } from './server.createOrder';
import MercadoPagoConfig, { Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
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
  address: string;
  city: string;
  province: string;
  zipCode: string;
  dni?: string;
};

export async function StartBuying(cart: CartItem[], customerData: BuyingFormData) {
  try {
    // 1. Validación final de stock
    const products = await getCartProducts(cart.map(item => item.id));
    
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
      return {
        success: false,
        error: 'insufficient_stock',
        issues: stockIssues
      };
    }

    // 2. Crear orden PENDIENTE antes de la preferencia de MercadoPago
    const orderResult = await createOrder({
      status: 'pending',
      customer: {
        nombre: `${customerData.firstName} ${customerData.lastName}`,
        email: customerData.email,
        telefono: customerData.phone,
        dni: customerData.dni || ''
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
        method: 'mercadopago',
        status: 'pending'
      },
      shipping: {
        direccion: customerData.address,
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
      return {
        success: false,
        error: 'order_creation_failed'
      };
    }

    const { orderNumber } = orderResult;

    // 3. Crear preferencia de MercadoPago
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
        customer_dni: customerData.dni || '',
        // Datos de envío
        shipping_address: customerData.address,
        shipping_city: customerData.city,
        shipping_province: customerData.province,
        shipping_zipcode: customerData.zipCode
      }
    };

    const response = await preference.create({ body: preferenceData });

    return {
      success: true,
      init_point: response.init_point!,
      preference_id: response.id!,
      orderNumber
    };

  } catch (error) {
    console.error('Error en StartBuying:', error);
    
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