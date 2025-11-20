'use server'

import { client } from '@/sanity/lib/client';
import type { Category } from '@/types/sanity';
import { updateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/constants/cachetags';

/**
 * Obtiene todas las categorías con información de subcategorías.
 * Las categorías cambian poco, por eso se cachean por más tiempo.
 */
export async function getCategories(): Promise<Category[]> {
    
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
        },
        "childrenCount": count(*[_type == "category" && parent._ref == ^._id])
    }`;

    const categories = await client.fetch(query);
    return categories;
}

/**
 * Obtiene una categoría por slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    
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
 * Obtiene una categoría y todas sus subcategorías recursivamente.
 * Útil para filtrar productos que pertenezcan a una categoría o cualquiera de sus hijas.
 */
export async function getCategoryWithChildren(slug: string): Promise<string[]> {

    const query = `
        *[_type == "category" && slug.current == $slug][0] {
            "slug": slug.current,
            "children": *[_type == "category" && parent._ref == ^._id].slug.current
        }
    `;

    const result = await client.fetch(query, { slug });
    
    if (!result) return [];
    
    // Retornar la categoría actual más todas sus hijas
    return [result.slug, ...(result.children || [])];
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

