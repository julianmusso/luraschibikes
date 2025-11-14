'use server'

import { client } from '@/sanity/lib/client';
import { PRODUCTS_PER_PAGE } from '@/lib/constants/limits';
import type { ProductFilters, ProductListResult } from '@/types/sanity';
import { cacheTag, cacheLife, updateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/constants/cachetags';

/**
 * Obtiene productos con filtros y paginación.
 * Usa cacheTag para revalidación granular y cacheLife para TTL.
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
    'use cache';
    
    // Configurar caché con tags dinámicos
    const tags: string[] = [CACHE_TAGS.PRODUCTS_LIST];
    
    if (filters.category) {
        tags.push(CACHE_TAGS.productsByCategory(filters.category));
    }
    
    cacheTag(...tags);
    cacheLife({ stale: 3600 }); // 1 hora
    
    const {
        page = 1,
        category,
        minPrice,
        maxPrice,
        search,
        brand,
        status = 'published',
        sort = 'newest',
        attributes,
    } = filters;

    // Construir filtros GROQ dinámicamente
    const filterConditions = ['_type == \"product\"'];
    
    if (status) {
        filterConditions.push(`status == "${status}"`);
    }
    
    if (category) {
        filterConditions.push(`"${category}" in categories[]->slug.current`);
    }
    
    if (minPrice !== undefined) {
        filterConditions.push(`price >= ${minPrice}`);
    }
    
    if (maxPrice !== undefined) {
        filterConditions.push(`price <= ${maxPrice}`);
    }
    
    if (search) {
        // Búsqueda case-insensitive en nombre y descripción
        filterConditions.push(`(name match "${search}*" || description match "${search}*")`);
    }
    
    if (brand) {
        filterConditions.push(`brand == "${brand}"`);
    }

    // Filtros por atributos dinámicos
    if (attributes && Object.keys(attributes).length > 0) {
        Object.entries(attributes).forEach(([attrSlug, values]) => {
            if (values && values.length > 0) {
                // Para cada atributo, verificar que el producto tenga al menos uno de los valores seleccionados
                const valueConditions = values.map(valueSlug => 
                    `"${valueSlug}" in filterAttributes[attribute->slug.current == "${attrSlug}"].selectedValues[]`
                ).join(' || ');
                
                filterConditions.push(`(${valueConditions})`);
            }
        });
    }

    const filterString = filterConditions.join(' && ');

    // Ordenamiento
    let orderBy = '_createdAt desc';
    switch (sort) {
        case 'oldest':
            orderBy = '_createdAt asc';
            break;
        case 'price-asc':
            orderBy = 'price asc';
            break;
        case 'price-desc':
            orderBy = 'price desc';
            break;
        case 'name-asc':
            orderBy = 'name asc';
            break;
        case 'name-desc':
            orderBy = 'name desc';
            break;
    }

    // Paginación
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;

    // Query GROQ
    const query = `{
        "products": *[${filterString}] | order(${orderBy}) [${start}...${end}] {
            _id,
            name,
            slug,
            description,
            price,
            salePrice,
            brand,
            badge,
            stock,
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
            }
        },
        "total": count(*[${filterString}])
    }`;

    const result = await client.fetch(query);
    
    const totalPages = Math.ceil(result.total / PRODUCTS_PER_PAGE);

    return {
        products: result.products,
        total: result.total,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
}

/**
 * Revalida el caché de la lista de productos
 */
export async function revalidateProducts(): Promise<void> {
    'use server';
    updateTag(CACHE_TAGS.PRODUCTS_LIST);
}

/**
 * Revalida el caché de productos por categoría
 */
export async function revalidateProductsByCategory(categorySlug: string): Promise<void> {
    'use server';
    updateTag(CACHE_TAGS.productsByCategory(categorySlug));
}

