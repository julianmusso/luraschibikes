import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";

export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle title="Carrito de Compras" />
            <LuraschiCard>
                <div className="text-center py-12 text-slate-400">
                    Cargando carrito...
                </div>
            </LuraschiCard>
        </main>
    );
}
