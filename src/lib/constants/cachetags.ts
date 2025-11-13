/**
 * Tags de caché estandarizados para revalidación granular
 */
export const CACHE_TAGS = {
    PRODUCTS_LIST: 'products-list',
    CATEGORIES_LIST: 'categories-list',
    
    // Funciones para tags dinámicos
    product: (id: string) => `product-${id}`,
    productBySlug: (slug: string) => `product-slug-${slug}`,
    category: (id: string) => `category-${id}`,
    categoryBySlug: (slug: string) => `category-slug-${slug}`,
    productsByCategory: (categorySlug: string) => `products-category-${categorySlug}`,
} as const;

