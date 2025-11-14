'use server'

import { client } from '@/sanity/lib/client';
import { cacheTag, cacheLife, updateTag } from 'next/cache';

/**
 * Obtiene todas las marcas únicas de productos publicados
 */
export async function getBrands(): Promise<string[]> {
    'use cache';
    
    cacheTag('brands-list');
    cacheLife({ stale: 3600 }); // 1 hora
    
    const query = `array::unique(*[_type == "product" && status == "published" && defined(brand)].brand) | order(@)`;

    const brands = await client.fetch(query);
    return brands || [];
}

/**
 * Revalida el caché de marcas
 */
export async function revalidateBrands(): Promise<void> {
    'use server';
    updateTag('brands-list');
}
