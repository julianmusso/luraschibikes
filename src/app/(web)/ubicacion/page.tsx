import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";

export default function Ubicacion_Page() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle
                title="Ubicación"
                subtitle="Próximamente encontrarás aquí nuestros puntos de venta."
            />
            <LuraschiCard>
                <p className="">Esta sección está en construcción. ¡Vuelve pronto para descubrir dónde puedes encontrar nuestras bicicletas!</p>
            </LuraschiCard>
        </main>
    )
}