export type ProductFilters = {
    page?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    brand?: string;
    status?: 'published' | 'draft' | 'archived';
    sort?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
    // Atributos filtrables dinámicos: { "tipo-freno": ["hidraulico", "disco"], "talla": ["m", "l"] }
    attributes?: Record<string, string[]>;
}

export type ProductListResult = {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export type Product = {
    _id: string;
    name: string;
    slug: { current: string };
    description?: string;
    price: number;
    salePrice?: number;
    brand?: string;
    badge?: 'new' | 'sale' | 'bestseller' | 'low-stock';
    stock: number;
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
}

export type Category = {
    _id: string;
    name: string;
    slug: { current: string };
    description?: string;
    image?: {
        asset: { url: string };
    };
    parent?: {
        _id: string;
        name: string;
        slug: { current: string };
    };
}
