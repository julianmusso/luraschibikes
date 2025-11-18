'use server'

import { client } from '@/sanity/lib/client';

type StockUpdate = {
  productId: string;
  quantity: number;
};

export async function updateProductsStock(items: StockUpdate[]) {
  try {
    // Actualizar stock de cada producto
    const updates = items.map(item => ({
      patch: {
        id: item.productId,
        dec: { stock: item.quantity }
      }
    }));

    // Ejecutar todas las actualizaciones
    await Promise.all(
      updates.map(update =>
        client
          .patch(update.patch.id)
          .dec({ stock: update.patch.dec.stock })
          .commit()
      )
    );

    return { success: true };

  } catch (error) {
    console.error('Error actualizando stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
