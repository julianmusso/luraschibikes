'use server'

import { client } from '@/sanity/lib/client';
import { updateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/constants/cachetags';

export type ProductDetail = {
    _id: string;
    name: string;
    slug: { current: string };
    description?: string;
    price: number;
    salePrice?: number;
    brand?: string;
    badge?: 'new' | 'sale' | 'bestseller' | 'low-stock';
    stock: number;
    lowStockThreshold?: number;
    sku: string;
    status: 'published' | 'draft' | 'archived';
    images: Array<{
        asset: { url: string };
        alt?: string;
    }>;
    categories?: Array<{
        _id: string;
        name: string;
        slug: { current: string };
    }>;
    specifications?: Array<{
        feature: {
            _id: string;
            name: string;
            icon?: string;
        };
        value: string;
        featured: boolean;
    }>;
    compatibility?: string[];
    variations?: Array<{
        sku: string;
        attributes: Array<{
            attribute: {
                _id: string;
                name: string;
                type: 'color' | 'text';
            };
            valueLabel: string;
        }>;
        price?: number;
        stock: number;
        image?: {
            asset: { url: string };
        };
    }>;
    relatedProducts?: Array<{
        _id: string;
        name: string;
        slug: { current: string };
        price: number;
        salePrice?: number;
        images: Array<{
            asset: { url: string };
        }>;
    }>;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
    };
}

/**
 * Obtiene un producto completo por slug (incluye variantes, specs, etc.)
 */
export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
    
    const query = `*[_type == "product" && slug.current == $slug && status == "published"][0] {
        _id,
        name,
        slug,
        description,
        price,
        salePrice,
        brand,
        badge,
        stock,
        lowStockThreshold,
        sku,
        status,
        "images": images[]{
            "asset": asset->{url},
            alt
        },
        "categories": categories[]->{
            _id,
            name,
            slug
        },
        "specifications": specifications[]{
            "feature": feature->{
                _id,
                name,
                icon
            },
            value,
            featured
        },
        compatibility,
        "variations": variations[]{
            sku,
            "attributes": attributes[]{
                "attribute": attribute->{
                    _id,
                    name,
                    type
                },
                valueLabel
            },
            price,
            stock,
            "image": image.asset->{url}
        },
        "relatedProducts": relatedProducts[]->{
            _id,
            name,
            slug,
            price,
            salePrice,
            "images": images[]{
                "asset": asset->{url}
            }
        },
        seo
    }`;

    const product = await client.fetch(query, { slug });
    return product || null;
}

/**
 * Revalida el caché de un producto específico por slug
 */
export async function revalidateProductBySlug(slug: string): Promise<void> {
    'use server';
    updateTag(CACHE_TAGS.productBySlug(slug));
}

/**
 * Revalida el caché de múltiples productos por sus slugs
 */
export async function revalidateProductsBySlugs(slugs: string[]): Promise<void> {
    'use server';
    for (const slug of slugs) {
        updateTag(CACHE_TAGS.productBySlug(slug));
    }
}

/**
 * Revalida el caché de un producto por ID
 */
export async function revalidateProductById(id: string): Promise<void> {
    'use server';
    updateTag(CACHE_TAGS.product(id));
}

/**
 * Revalida el caché de múltiples productos por sus IDs
 */
export async function revalidateProductsByIds(ids: string[]): Promise<void> {
    'use server';
    if (!Array.isArray(ids) || ids.length === 0) return;
    
    for (const id of ids) {
        updateTag(CACHE_TAGS.product(id));
    }
}
