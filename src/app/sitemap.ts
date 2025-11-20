import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:4000';

    // Obtener todos los productos publicados
    const products = await client.fetch<Array<{ slug: { current: string }; _updatedAt: string }>>(
        `*[_type == "product" && status == "published"] {
            slug,
            _updatedAt
        }`
    );

    // Obtener todas las categorías
    const categories = await client.fetch<Array<{ slug: { current: string } }>>(
        `*[_type == "category"] {
            slug
        }`
    );

    // URLs estáticas
    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/tienda`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/ubicacion`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // URLs de productos
    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/tienda/${product.slug.current}`,
        lastModified: new Date(product._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // URLs de categorías
    const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/tienda?category=${category.slug.current}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticUrls, ...productUrls, ...categoryUrls];
}
