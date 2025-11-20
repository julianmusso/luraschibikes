'use server'

import { client } from '@/sanity/lib/client';
import { updateTag } from 'next/cache';

type OrderItem = {
  productId: string;
  quantity: number;
  productSnapshot: {
    name: string;
    price: number;
    image: string;
  };
};

type OrderData = {
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
  customer: {
    nombre: string;
    email: string;
    telefono: string;
    dni: string;
  };
  items: OrderItem[];
  payment: {
    method: string;
    status: string;
    transactionId?: string;
    preferenceId?: string;
    amount?: number;
  };
  shipping: {
    direccion: string;
    numero: string;
    piso?: string;
    departamento?: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    tracking?: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
};

export async function createOrder(orderData: OrderData) {
  try {
    // Generar número de orden único
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${dateStr}-${randomNum}`;

    // Crear documento en Sanity
    const order = await client.create({
      _type: 'order',
      orderNumber,
      status: orderData.status,
      
      customer: {
        email: orderData.customer.email,
        name: orderData.customer.nombre,
        phone: orderData.customer.telefono,
        dni: orderData.customer.dni
      },
      
      items: orderData.items.map(item => ({
        _key: `item-${item.productId}`,
        product: {
          _type: 'reference',
          _ref: item.productId
        },
        productSnapshot: {
          name: item.productSnapshot.name,
          sku: '',
          imageUrl: item.productSnapshot.image
        },
        quantity: item.quantity,
        unitPrice: item.productSnapshot.price,
        subtotal: item.productSnapshot.price * item.quantity
      })),
      
      payment: {
        mercadopagoId: orderData.payment.transactionId || '',
        preferenceId: orderData.payment.preferenceId || '',
        status: orderData.payment.status,
        paymentMethod: orderData.payment.method,
        transactionAmount: orderData.payment.amount || orderData.totals.total
      },
      
      shipping: {
        address: {
          street: orderData.shipping.direccion,
          number: orderData.shipping.numero,
          floor: orderData.shipping.piso || '',
          city: orderData.shipping.ciudad,
          state: orderData.shipping.provincia,
          zipCode: orderData.shipping.codigoPostal,
          country: 'Argentina'
        },
        method: 'delivery',
        cost: orderData.totals.shipping
      },
      
      totals: {
        subtotal: orderData.totals.subtotal,
        shipping: orderData.totals.shipping,
        discount: 0,
        total: orderData.totals.total
      },
      
      createdAt: now.toISOString(),
      paidAt: orderData.status === 'paid' ? now.toISOString() : undefined
    });

    // Invalidar cache de productos
    updateTag('products');

    return {
      success: true,
      orderId: order._id,
      orderNumber
    };

  } catch (error) {
    console.error('Error creando orden:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
