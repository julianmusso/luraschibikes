import { PageTitle } from "@/components/ui/ui.page.title";
import { ProductGridSkeleton } from "@/components/product/product.card.skeleton";
import { ProductFiltersSkeleton } from "@/components/product/tienda.filters.skeleton";
import type { ProductFilters as Filters } from "@/types/sanity";
import { Suspense } from "react";
import { ProductList } from "./product-list";
import { FilterPanel } from "./filter-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Tienda de Bicicletas',
    description: 'Explora nuestro catálogo completo de bicicletas de montaña, ruta, urbanas y accesorios. Filtra por marca, precio, categoría y características para encontrar tu bicicleta ideal.',
    keywords: ['comprar bicicletas', 'tienda de bicicletas', 'bicicletas en venta', 'catálogo de bicicletas', 'mountain bike', 'bicicletas de ruta'],
    openGraph: {
        title: 'Tienda de Bicicletas | Luraschi Bikes',
        description: 'Explora nuestro catálogo completo de bicicletas de montaña, ruta, urbanas y accesorios.',
        type: 'website',
        url: '/tienda',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tienda de Bicicletas | Luraschi Bikes',
        description: 'Explora nuestro catálogo completo de bicicletas de montaña, ruta, urbanas y accesorios.',
    },
    alternates: {
        canonical: '/tienda',
    },
};

export default async function Tienda_Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Transformar searchParams en filters - la promise se resuelve dentro del Suspense
    const filters = searchParams.then((params): Filters => {
        // Extraer atributos dinámicos (cualquier param que no sea conocido)
        const knownParams = ['page', 'category', 'minPrice', 'maxPrice', 'search', 'brand', 'sort'];
        const attributes: Record<string, string[]> = {};
        
        Object.entries(params).forEach(([key, value]) => {
            if (!knownParams.includes(key) && typeof value === 'string') {
                // Este es un atributo filtrable (ej: tipo-freno=hidraulico,disco)
                attributes[key] = value.split(',');
            }
        });

        return {
            page: params.page ? Number(params.page) : 1,
            category: typeof params.category === 'string' ? params.category : undefined,
            minPrice: params.minPrice ? Number(params.minPrice) : undefined,
            maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
            search: typeof params.search === 'string' ? params.search : undefined,
            brand: typeof params.brand === 'string' ? params.brand : undefined,
            sort: params.sort as Filters['sort'],
            attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        };
    });

    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            {/* JSON-LD Structured Data para SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: 'Tienda de Bicicletas',
                        description: 'Catálogo completo de bicicletas y accesorios',
                        url: `${process.env.NEXT_PUBLIC_URL}/tienda`,
                        breadcrumb: {
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                                {
                                    '@type': 'ListItem',
                                    position: 1,
                                    name: 'Inicio',
                                    item: process.env.NEXT_PUBLIC_URL,
                                },
                                {
                                    '@type': 'ListItem',
                                    position: 2,
                                    name: 'Tienda',
                                    item: `${process.env.NEXT_PUBLIC_URL}/tienda`,
                                },
                            ],
                        },
                    }),
                }}
            />
            
            <PageTitle title="Tienda" />
            
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-8">
                {/* Panel de filtros - 1 columna de 4 (25%) */}
                <div className="lg:col-span-2">
                    <Suspense fallback={<ProductFiltersSkeleton />}>
                        <FilterPanel />
                    </Suspense>
                </div>

                {/* Lista de productos - 3 columnas de 4 (75%) */}
                <div className="lg:col-span-5">
                    <Suspense fallback={<ProductGridSkeleton count={6} />}>
                        <ProductList filters={filters} />
                    </Suspense>
                </div>
            </div>
        </main>
    )
}
