import { Suspense } from "react";
import { ProductDetail } from "./product-detail";
import { ProductDetailSkeleton } from "@/components/product/product-detail.skeleton";

export default async function Producto_Page({
    params,
}: {
    params: Promise<{ productSlug: string }>;
}) {
    const slug = params.then(p => p.productSlug);

    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductDetail slug={slug} />
            </Suspense>
        </main>
    )
}