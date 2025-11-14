import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/sanity';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercentage = hasDiscount 
        ? Math.round(((product.price - (product.salePrice ?? 0)) / product.price) * 100)
        : 0;

    const displayPrice = product.salePrice || product.price;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <Link href={`/tienda/${product.slug.current}`}>
            <div className="group border border-sky-500 bg-slate-900/80 text-white rounded-lg overflow-hidden hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                {/* Imagen del producto */}
                <div className="relative aspect-square bg-slate-800/50 overflow-hidden">
                    <Image
                        src={product.images?.[0]?.asset.url || '/assets/images/product-placeholder.png'}
                        alt={product.images?.[0]?.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                        {product.badge === 'new' && (
                            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                NUEVO
                            </span>
                        )}
                        {product.badge === 'bestseller' && (
                            <span className="bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded">
                                MÁS VENDIDO
                            </span>
                        )}
                        {hasDiscount && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                -{discountPercentage}%
                            </span>
                        )}
                        {isLowStock && (
                            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                ÚLTIMAS UNIDADES
                            </span>
                        )}
                    </div>

                    {/* Stock agotado */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg border border-slate-600">
                                SIN STOCK
                            </span>
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="p-4 space-y-2">
                    {/* Nombre */}
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                    </h3>

                    {/* Marca */}
                    {product.brand && (
                        <p className="text-sm text-slate-400">{product.brand}</p>
                    )}

                    {/* Precio */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-sky-400">
                            ${displayPrice.toLocaleString('es-AR')}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-slate-500 line-through">
                                ${product.price.toLocaleString('es-AR')}
                            </span>
                        )}
                    </div>

                    {/* Categorías */}
                    {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                            {product.categories.slice(0, 2).map((category) => (
                                <span
                                    key={category._id}
                                    className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded"
                                >
                                    {category.name}
                                </span>
                            ))}
                            {product.categories.length > 2 && (
                                <span className="text-xs text-slate-400 px-2 py-1">
                                    +{product.categories.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
