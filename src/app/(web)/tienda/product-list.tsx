import { ProductCard } from "@/components/product/product.card";
import { getProducts } from "@/core/server.getProducts";
import type { ProductFilters as Filters } from "@/types/sanity";

export async function ProductList({ filters }: { filters: Promise<Filters> }) {
    const resolvedFilters = await filters;
    const { products } = await getProducts(resolvedFilters);

    if (products.length === 0) {
        return (
            <div className="border border-sky-500 bg-slate-900/80 text-white rounded-lg p-8 text-center">
                <p className="text-slate-400">No se encontraron productos.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}
