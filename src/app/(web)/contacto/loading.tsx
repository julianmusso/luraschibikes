import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";

export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle
                title="Contacto y Ubicación"
                subtitle="Visitanos en nuestros locales, escribinos por WhatsApp o completá el formulario"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información skeleton */}
                <div className="space-y-6 order-2 lg:order-1">
                    <LuraschiCard>
                        <div className="space-y-4 animate-pulse">
                            <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                            <div className="h-20 bg-slate-700 rounded"></div>
                            <div className="h-20 bg-slate-700 rounded"></div>
                        </div>
                    </LuraschiCard>
                    
                    <LuraschiCard>
                        <div className="space-y-3 animate-pulse">
                            <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                            <div className="h-8 bg-slate-700 rounded"></div>
                            <div className="h-8 bg-slate-700 rounded"></div>
                            <div className="h-8 bg-slate-700 rounded"></div>
                        </div>
                    </LuraschiCard>

                    <LuraschiCard>
                        <div className="h-14 bg-slate-700 rounded animate-pulse"></div>
                    </LuraschiCard>
                </div>

                {/* Mapa skeleton */}
                <div className="lg:sticky lg:top-24 h-fit order-1 lg:order-2">
                    <LuraschiCard>
                        <div className="space-y-4">
                            <div className="h-6 bg-slate-700 rounded w-1/2 animate-pulse"></div>
                            <div className="aspect-square lg:aspect-4/5 bg-slate-700 rounded animate-pulse"></div>
                        </div>
                    </LuraschiCard>
                </div>
            </div>
        </main>
    );
}
