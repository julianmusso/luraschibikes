import { PageTitle } from "@/components/ui/ui.page.title";
import { ProductGridSkeleton } from "@/components/product/product.card.skeleton";
import { ProductFiltersSkeleton } from "@/components/product/tienda.filters.skeleton";

export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle title="Tienda" />
            
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-8">
                {/* Panel de filtros skeleton */}
                <div className="lg:col-span-2">
                    <ProductFiltersSkeleton />
                </div>

                {/* Grid de productos skeleton */}
                <div className="lg:col-span-5">
                    <ProductGridSkeleton count={6} />
                </div>
            </div>
        </main>
    );
}
