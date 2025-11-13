'use server'

import { client } from '@/sanity/lib/client';
import type { Category } from '@/types/sanity';
import { cacheTag, cacheLife, updateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/constants/cachetags';

/**
 * Obtiene todas las categorías.
 * Las categorías cambian poco, por eso se cachean por más tiempo.
 */
export async function getCategories(): Promise<Category[]> {
    'use cache';
    
    cacheTag(CACHE_TAGS.CATEGORIES_LIST);
    cacheLife({ stale: 86400 }); // 24 horas
    
    const query = `*[_type == "category"] | order(name asc) {
        _id,
        name,
        slug,
        description,
        "image": image.asset->{url},
        "parent": parent->{
            _id,
            name,
            slug
        }
    }`;

    const categories = await client.fetch(query);
    return categories;
}

/**
 * Obtiene una categoría por slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    'use cache';
    
    cacheTag(CACHE_TAGS.categoryBySlug(slug));
    cacheLife({ stale: 86400 }); // 24 horas
    
    const query = `*[_type == "category" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        description,
        "image": image.asset->{url},
        "parent": parent->{
            _id,
            name,
            slug
        }
    }`;

    const category = await client.fetch(query, { slug });
    return category || null;
}

/**
 * Obtiene categorías principales (sin padre).
 */
export async function getRootCategories(): Promise<Category[]> {
    'use cache';
    
    cacheTag(CACHE_TAGS.CATEGORIES_LIST, 'root-categories');
    cacheLife({ stale: 86400 }); // 24 horas
    
    const query = `*[_type == "category" && !defined(parent)] | order(name asc) {
        _id,
        name,
        slug,
        description,
        "image": image.asset->{url}
    }`;

    const categories = await client.fetch(query);
    return categories;
}

/**
 * Revalida el caché de todas las categorías
 */
export async function revalidateCategories(): Promise<void> {
    'use server';
    updateTag(CACHE_TAGS.CATEGORIES_LIST);
}

/**
 * Revalida el caché de una categoría específica por slug
 */
export async function revalidateCategoryBySlug(slug: string): Promise<void> {
    'use server';
    updateTag(CACHE_TAGS.categoryBySlug(slug));
}

/**
 * Revalida el caché de una categoría por ID
 */
export async function revalidateCategoryById(id: string): Promise<void> {
    'use server';
    updateTag(CACHE_TAGS.category(id));
}

