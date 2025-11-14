export function ProductDetailSkeleton() {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2 items-center">
                <div className="h-4 bg-slate-700 rounded w-12" />
                <div className="h-4 bg-slate-700 rounded w-1" />
                <div className="h-4 bg-slate-700 rounded w-16" />
                <div className="h-4 bg-slate-700 rounded w-1" />
                <div className="h-4 bg-slate-700 rounded w-24" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Galería skeleton */}
                <div className="space-y-4 col-span-3">
                    <div className="border border-sky-500 bg-slate-900/80 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-slate-800/50 rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Info skeleton */}
                <div className=" col-span-2 border border-sky-500 bg-slate-900/80 rounded-lg p-6 space-y-6">
                    {/* Badges */}
                    <div className="flex gap-2">
                        <div className="h-6 bg-slate-700 rounded w-20" />
                        <div className="h-6 bg-slate-700 rounded w-24" />
                    </div>

                    {/* Título */}
                    <div className="h-10 bg-slate-700 rounded w-3/4" />

                    {/* Marca */}
                    <div className="h-6 bg-slate-700 rounded w-1/3" />

                    {/* Precio */}
                    <div className="space-y-2">
                        <div className="h-12 bg-slate-700 rounded w-1/2" />
                        <div className="h-5 bg-slate-700 rounded w-1/3" />
                    </div>

                    {/* Stock */}
                    <div className="h-6 bg-slate-700 rounded w-1/4" />

                    {/* SKU */}
                    <div className="h-5 bg-slate-700 rounded w-1/3" />

                    {/* Descripción */}
                    <div className="border-t border-slate-700 pt-6 space-y-3">
                        <div className="h-4 bg-slate-700 rounded w-full" />
                        <div className="h-4 bg-slate-700 rounded w-full" />
                        <div className="h-4 bg-slate-700 rounded w-3/4" />
                    </div>

                    {/* Botón */}
                    <div className="border-t border-slate-700 pt-6 space-y-2.5">
                        <div className="h-12 bg-slate-700 rounded w-full" />
                        <div className="h-12 bg-slate-700 rounded w-full" />
                    </div>

                    {/* Categorías */}
                    <div className="border-t border-slate-700 pt-6">
                        <div className="h-4 bg-slate-700 rounded w-20 mb-2" />
                        <div className="flex gap-2">
                            <div className="h-8 bg-slate-700 rounded w-24" />
                            <div className="h-8 bg-slate-700 rounded w-20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Especificaciones skeleton */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-6">
                <div className="h-8 bg-slate-700 rounded w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-slate-700 pb-3">
                            <div className="h-5 bg-slate-700 rounded w-1/3" />
                            <div className="h-5 bg-slate-700 rounded w-1/4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
