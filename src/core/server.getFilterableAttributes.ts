'use server'

import { client } from '@/sanity/lib/client';
import { cacheTag, cacheLife, updateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/constants/cachetags';

export type FilterAttribute = {
    _id: string;
    name: string;
    slug: { current: string };
    icon?: string;
    inputType: 'checkbox' | 'radio' | 'select';
    priority: number;
    values: Array<{
        label: string;
        slug: { current: string };
    }>;
}

/**
 * Obtiene todos los atributos filtrables configurados en Sanity
 * Solo retorna atributos marcados como filtrables
 */
export async function getFilterableAttributes(): Promise<FilterAttribute[]> {
    'use cache';
    
    cacheTag('filter-attributes');
    cacheLife({ stale: 86400 }); // 24 horas - rara vez cambian
    
    const query = `*[_type == "filterAttribute" && filterable == true] | order(priority asc, name asc) {
        _id,
        name,
        slug,
        icon,
        inputType,
        priority,
        "values": values[]{
            label,
            slug
        }
    }`;

    const attributes = await client.fetch(query);
    return attributes || [];
}

/**
 * Revalida el caché de atributos filtrables
 */
export async function revalidateFilterAttributes(): Promise<void> {
    'use server';
    updateTag('filter-attributes');
}
