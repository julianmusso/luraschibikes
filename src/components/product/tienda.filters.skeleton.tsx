export function ProductFiltersSkeleton() {
    return (
        <aside className="space-y-6 animate-pulse">
            {/* Búsqueda skeleton */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <div className="h-5 bg-slate-700 rounded w-1/3 mb-3" />
                <div className="h-10 bg-slate-700 rounded w-full" />
            </div>

            {/* Precio skeleton */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <div className="h-5 bg-slate-700 rounded w-1/4 mb-3" />
                <div className="space-y-3">
                    <div>
                        <div className="h-4 bg-slate-700 rounded w-16 mb-1" />
                        <div className="h-10 bg-slate-700 rounded w-full" />
                    </div>
                    <div>
                        <div className="h-4 bg-slate-700 rounded w-16 mb-1" />
                        <div className="h-10 bg-slate-700 rounded w-full" />
                    </div>
                </div>
            </div>

            {/* Marca skeleton */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <div className="h-5 bg-slate-700 rounded w-1/4 mb-3" />
                <div className="h-10 bg-slate-700 rounded w-full" />
            </div>

            {/* Botón skeleton */}
            <div className="h-10 bg-slate-700 rounded w-full" />
        </aside>
    );
}
