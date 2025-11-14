import { ProductDetailSkeleton } from "@/components/product/product-detail.skeleton";

export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <ProductDetailSkeleton />
        </main>
    );
}
