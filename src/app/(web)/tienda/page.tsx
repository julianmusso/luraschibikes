import { PageTitle } from "@/components/ui/ui.page.title";
import { ProductGridSkeleton } from "@/components/product/product.card.skeleton";
import { ProductFiltersSkeleton } from "@/components/product/tienda.filters.skeleton";
import type { ProductFilters as Filters } from "@/types/sanity";
import { Suspense } from "react";
import { ProductList } from "./product-list";
import { FilterPanel } from "./filter-panel";

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
