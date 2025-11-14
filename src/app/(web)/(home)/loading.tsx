export default function Loading() {
    return (
        <main>
            <section className="relative bg-black text-white h-[500px] sm:h-[600px] md:h-[calc(100vh-80px)] flex items-center">
                {/* Fondo oscuro para simular imagen */}
                <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>

                {/* Contenido skeleton */}
                <div className="relative z-10 w-full">
                    <div className="max-w-7xl mx-auto px-8 flex flex-col justify-center h-full space-y-4">
                        {/* Título "LURASCHI" skeleton */}
                        <div className="h-24 sm:h-28 md:h-32 lg:h-36 bg-slate-700 rounded w-4/5 animate-pulse"></div>
                        
                        {/* Título "BIKES" skeleton */}
                        <div className="h-24 sm:h-28 md:h-32 lg:h-36 bg-slate-700 rounded w-3/5 animate-pulse"></div>
                        
                        {/* Subtítulo skeleton */}
                        <div className="mt-4 h-6 sm:h-7 md:h-8 bg-slate-700 rounded w-1/2 max-w-xl animate-pulse"></div>
                        
                        {/* Botón skeleton */}
                        <div className="mt-8 h-12 sm:h-16 bg-slate-700 rounded w-48 sm:w-64 animate-pulse"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
