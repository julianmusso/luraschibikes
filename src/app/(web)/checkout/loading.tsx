import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";

export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle title="Finalizar Compra" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario skeleton */}
                <div className="lg:col-span-2">
                    <LuraschiCard>
                        <div className="space-y-6 animate-pulse">
                            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                            <div className="space-y-3">
                                <div className="h-10 bg-slate-700 rounded"></div>
                                <div className="h-10 bg-slate-700 rounded"></div>
                                <div className="h-10 bg-slate-700 rounded"></div>
                            </div>
                            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                            <div className="space-y-3">
                                <div className="h-10 bg-slate-700 rounded"></div>
                                <div className="h-10 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </LuraschiCard>
                </div>

                {/* Resumen skeleton */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <LuraschiCard>
                        <div className="space-y-4 animate-pulse">
                            <div className="h-6 bg-slate-700 rounded w-2/3"></div>
                            <div className="h-20 bg-slate-700 rounded"></div>
                            <div className="h-12 bg-slate-700 rounded"></div>
                        </div>
                    </LuraschiCard>
                </div>
            </div>
        </main>
    );
}
