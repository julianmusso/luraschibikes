import { getFilterableAttributes } from "@/core/server.getFilterableAttributes";
import { getBrands } from "@/core/server.getBrands";
import { getCategories } from "@/core/server.getCategories";
import { ProductFilters } from "@/components/product/product.filters";

export async function FilterPanel() {
    // Cargar datos para filtros
    const [filterAttributes, brands, categories] = await Promise.all([
        getFilterableAttributes(),
        getBrands(),
        getCategories(),
    ]);

    return (
        <ProductFilters
            filterAttributes={filterAttributes}
            categories={categories}
            brands={brands}
        />
    );
}
