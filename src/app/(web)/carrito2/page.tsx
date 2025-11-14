import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";
import { getWhatsAppLink } from "@/lib/helpers/whatsapp";
import { FaWhatsapp, FaShoppingCart } from "react-icons/fa";

export default function Carrito_Page() {
    return (
        <main className="max-w-4xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle
                title="Carrito de Compras"
                subtitle="Comprá de forma rápida y segura por WhatsApp"
            />

            <LuraschiCard>
                <div className="text-center space-y-6 py-8">
                    <FaShoppingCart className="text-6xl text-blue-400 mx-auto" />
                    
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold">Comprá Directo por WhatsApp</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            Para brindarte la mejor atención y asesoramiento personalizado, 
                            todas nuestras ventas se realizan a través de WhatsApp.
                        </p>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            Contanos qué productos te interesan y te armamos un presupuesto 
                            a medida con los mejores precios y formas de pago.
                        </p>
                    </div>

                    <div className="pt-4">
                        <a
                            href={getWhatsAppLink("Hola! Quiero consultar sobre productos de la tienda.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
                        >
                            <FaWhatsapp className="text-2xl" />
                            Consultar por WhatsApp
                        </a>
                    </div>

                    <div className="pt-6 border-t border-slate-700">
                        <p className="text-sm text-slate-400">
                            También podés visitarnos en nuestros locales para ver los productos en persona
                        </p>
                    </div>
                </div>
            </LuraschiCard>
        </main>
    );
}