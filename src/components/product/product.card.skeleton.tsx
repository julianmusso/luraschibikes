export function ProductCardSkeleton() {
    return (
        <div className="border border-sky-500 bg-slate-900/80 rounded-lg overflow-hidden animate-pulse">
            {/* Imagen skeleton */}
            <div className="aspect-square bg-slate-800/50" />
            
            {/* Contenido skeleton */}
            <div className="p-4 space-y-3">
                {/* Nombre */}
                <div className="h-6 bg-slate-700 rounded w-3/4" />
                <div className="h-6 bg-slate-700 rounded w-1/2" />
                
                {/* Marca */}
                <div className="h-4 bg-slate-700 rounded w-1/3" />
                
                {/* Precio */}
                <div className="h-8 bg-slate-700 rounded w-2/5" />
                
                {/* Categorías */}
                <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-slate-700 rounded w-16" />
                    <div className="h-6 bg-slate-700 rounded w-20" />
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
