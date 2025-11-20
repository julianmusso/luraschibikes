import { Suspense } from "react";
import { ProductDetail } from "./product-detail";
import { ProductDetailSkeleton } from "@/components/product/product-detail.skeleton";
import type { Metadata } from "next";
import { getProductBySlug } from "@/core/server.getProduct";

type Props = {
    params: Promise<{ productSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productSlug } = await params;
    const product = await getProductBySlug(productSlug);

    if (!product) {
        return {
            title: 'Producto no encontrado',
        };
    }

    const imageUrl = product.images?.[0]?.asset?.url || '';
    const category = product.categories?.[0];
    const brand = product.brand;

    return {
        title: product.seo?.metaTitle || product.name,
        description: product.seo?.metaDescription || product.description || `${product.name} - Disponible en Luraschi Bikes. ${product.stock > 0 ? 'En stock' : 'Consultar disponibilidad'}.`,
        keywords: [
            product.name,
            category?.name || '',
            brand || '',
            'bicicleta',
            'ciclismo',
            ...(product.specifications?.filter(s => s.featured).map(s => s.feature.name) || []),
        ].filter(Boolean),
        openGraph: {
            title: product.seo?.metaTitle || product.name,
            description: product.seo?.metaDescription || product.description || `${product.name} - Disponible en Luraschi Bikes`,
            type: 'website',
            url: `/tienda/${productSlug}`,
            images: imageUrl ? [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.images?.[0]?.alt || product.name,
                },
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.seo?.metaTitle || product.name,
            description: product.seo?.metaDescription || product.description || `${product.name} - Disponible en Luraschi Bikes`,
            images: imageUrl ? [imageUrl] : [],
        },
        alternates: {
            canonical: `/tienda/${productSlug}`,
        },
    };
}

export default async function Producto_Page({
    params,
}: Props) {
    const slug = params.then(p => p.productSlug);

    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductDetail slug={slug} />
            </Suspense>
        </main>
    )
}