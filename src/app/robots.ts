import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:4000';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/checkout/',
                    '/cuenta/',
                    '/pedido/',
                    '/login/',
                    '/carrito/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/checkout/',
                    '/cuenta/',
                    '/pedido/',
                    '/login/',
                    '/carrito/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
