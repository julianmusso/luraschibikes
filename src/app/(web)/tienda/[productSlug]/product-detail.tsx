import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/core/server.getProduct";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { AddToCart_Component } from "@/components/product/product.add-to-cart";
import { ProductCard } from "@/components/product/product.card";
import { FaTag, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ProductWhatsApp_Component } from "@/components/product/product.whatsapp";

export async function ProductDetail({ slug }: { slug: Promise<string> }) {
    const resolvedSlug = await slug;
    const product = await getProductBySlug(resolvedSlug);

    if (!product) {
        notFound();
    }

    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - (product.salePrice ?? 0)) / product.price) * 100)
        : 0;
    const displayPrice = product.salePrice || product.price;
    const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
    const inStock = product.stock > 0;

    // JSON-LD Structured Data para Product
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || product.name,
        image: product.images?.map(img => img.asset.url) || [],
        sku: product.sku,
        brand: product.brand ? {
            '@type': 'Brand',
            name: product.brand,
        } : undefined,
        offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_URL}/tienda/${resolvedSlug}`,
            priceCurrency: 'ARS',
            price: displayPrice,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
            availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
                '@type': 'Organization',
                name: 'Luraschi Bikes',
            },
        },
        category: product.categories?.[0]?.name,
        ...(product.specifications && product.specifications.length > 0 && {
            additionalProperty: product.specifications.map(spec => ({
                '@type': 'PropertyValue',
                name: spec.feature.name,
                value: spec.value,
            })),
        }),
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
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
            ...(product.categories && product.categories.length > 0 ? [{
                '@type': 'ListItem',
                position: 3,
                name: product.categories[0].name,
                item: `${process.env.NEXT_PUBLIC_URL}/tienda?category=${product.categories[0].slug.current}`,
            }] : []),
            {
                '@type': 'ListItem',
                position: product.categories && product.categories.length > 0 ? 4 : 3,
                name: product.name,
                item: `${process.env.NEXT_PUBLIC_URL}/tienda/${resolvedSlug}`,
            },
        ],
    };

    return (
        <div className="space-y-5">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-400">
                <Link href="/" className="hover:text-blue-400">Inicio</Link>
                <span className="mx-2">/</span>
                <Link href="/tienda" className="hover:text-blue-400">Tienda</Link>
                {product.categories && product.categories.length > 0 && (
                    <>
                        <span className="mx-2">/</span>
                        <Link
                            href={`/tienda?category=${product.categories[0].slug.current}`}
                            className="hover:text-blue-400"
                        >
                            {product.categories[0].name}
                        </Link>
                    </>
                )}
                <span className="mx-2">/</span>
                <span className="text-white">{product.name}</span>
            </nav>

            {/* Producto principal */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Galería de imágenes */}
                <div className="col-span-3">
                    <ProductImageGallery images={product.images} productName={product.name} />
                </div>

                {/* Información del producto */}
                <div className="col-span-2 border border-sky-500 bg-slate-900/80 rounded-lg p-7 space-y-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        {product.badge === 'new' && (
                            <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded">
                                NUEVO
                            </span>
                        )}
                        {product.badge === 'bestseller' && (
                            <span className="bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded">
                                MÁS VENDIDO
                            </span>
                        )}
                        {hasDiscount && (
                            <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                                OFERTA -{discountPercentage}%
                            </span>
                        )}
                    </div>

                    {/* Nombre */}
                    <h1 className="text-3xl font-bold text-white">{product.name}</h1>

                    {/* Marca */}
                    {product.brand && (
                        <p className="text-lg text-slate-400 flex items-center gap-2">
                            <FaTag className="text-blue-400" />
                            {product.brand}
                        </p>
                    )}

                    {/* Precio */}
                    <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold text-blue-400">
                                ${displayPrice.toLocaleString('es-AR')}
                            </span>
                            {hasDiscount && (
                                <span className="text-2xl text-slate-500 line-through">
                                    ${product.price.toLocaleString('es-AR')}
                                </span>
                            )}
                        </div>
                        {hasDiscount && (
                            <p className="text-green-400 text-sm font-semibold">
                                ¡Ahorrás ${(product.price - displayPrice).toLocaleString('es-AR')}!
                            </p>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 text-base">
                        {inStock ? (
                            <>
                                <FaCheckCircle className="text-green-400" />
                                <span className="text-green-400 font-semibold">
                                    {isLowStock ? `Últimas ${product.stock} unidades` : 'En stock'}
                                </span>
                            </>
                        ) : (
                            <>
                                <FaTimesCircle className="text-red-400" />
                                <span className="text-red-400 font-semibold">Sin stock</span>
                            </>
                        )}
                    </div>

                    {/* SKU */}
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                        <FaBox />
                        SKU: {product.sku}
                    </p>

                    {/* Descripción 
                    {product.description && (
                        <div className="border-t border-slate-700 pt-6">
                            <p className="text-slate-300 leading-relaxed">{product.description}</p>
                        </div>
                    )}*/}

                    {/* Botón agregar al carrito */}
                    <div className="border-t border-slate-700 pt-6 space-y-2.5">
                        <ProductWhatsApp_Component productName={product.name} />
                        <AddToCart_Component
                            productId={product._id}
                            disabled={!inStock}
                        />
                    </div>

                    {/* Categorías */}
                    {product.categories && product.categories.length > 0 && (
                        <div className="border-t border-slate-700 pt-6">
                            <p className="text-sm text-slate-400 mb-2">Categorías:</p>
                            <div className="flex flex-wrap gap-2">
                                {product.categories.map((category) => (
                                    <Link
                                        key={category._id}
                                        href={`/tienda?category=${category.slug.current}`}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Especificaciones */}
            {product.specifications && product.specifications.length > 0 && (
                <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Especificaciones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.specifications.map((spec, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center border-b border-slate-700 pb-3"
                            >
                                <span className="text-slate-400">{spec.feature.name}</span>
                                <span className="text-white font-semibold">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Productos relacionados */}
            {product.relatedProducts && product.relatedProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Productos relacionados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {product.relatedProducts.map((relatedProduct) => (
                            <ProductCard
                                key={relatedProduct._id}
                                product={{
                                    ...relatedProduct,
                                    description: undefined,
                                    brand: undefined,
                                    badge: undefined,
                                    stock: 0,
                                    sku: '',
                                    status: 'published',
                                    categories: undefined,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}