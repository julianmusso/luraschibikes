import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";
import { LURASCHI_BIKES_ADDRESS_1, LURASCHI_BIKES_ADDRESS_2, LURASCHI_BIKES_EMAIL, LURASCHI_BIKES_PHONE, LURASCHI_BIKES_WHATSAPP } from "@/lib/constants/luraschibikes";
import { getWhatsAppLink } from "@/lib/helpers/whatsapp";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock } from "react-icons/fa";

export default function Contacto_Page() {

    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle
                title="Contacto y Ubicación"
                subtitle="Visitanos en nuestros locales, escribinos por WhatsApp o completá el formulario"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna izquierda: Información */}
                <div className="space-y-6 order-2 lg:order-1">
                    {/* Nuestros Locales */}
                    <LuraschiCard>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">Nuestros Locales</h2>
                        
                        <div className="space-y-4">
                            {/* Local 1 */}
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="font-semibold text-lg mb-2">Local Principal</h3>
                                <div className="space-y-2 text-slate-300">
                                    <p className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-blue-400 mt-1 shrink-0" />
                                        <span>{LURASCHI_BIKES_ADDRESS_1}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaClock className="text-blue-400 shrink-0" />
                                        <span>Lun a Vie: 9:00 - 19:00 | Sáb: 9:00 - 13:00</span>
                                    </p>
                                </div>
                            </div>

                            {/* Local 2 */}
                            <div className="pb-2">
                                <h3 className="font-semibold text-lg mb-2">Sucursal</h3>
                                <div className="space-y-2 text-slate-300">
                                    <p className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-blue-400 mt-1 shrink-0" />
                                        <span>{LURASCHI_BIKES_ADDRESS_2}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaClock className="text-blue-400 shrink-0" />
                                        <span>Lun a Vie: 9:00 - 19:00 | Sáb: 9:00 - 13:00</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </LuraschiCard>

                    {/* Contacto Directo */}
                    <LuraschiCard>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">Contacto Directo</h2>
                        <div className="space-y-3">
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-slate-300 hover:text-green-400 transition-colors"
                            >
                                <FaWhatsapp className="text-green-400 text-xl" />
                                <span>{LURASCHI_BIKES_PHONE}</span>
                            </a>
                            <a
                                href={`tel:${LURASCHI_BIKES_WHATSAPP}`}
                                className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <FaPhone className="text-blue-400 text-xl" />
                                <span>{LURASCHI_BIKES_PHONE}</span>
                            </a>
                            <a
                                href={`mailto:${LURASCHI_BIKES_EMAIL}`}
                                className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <FaEnvelope className="text-blue-400 text-xl" />
                                <span>{LURASCHI_BIKES_EMAIL}</span>
                            </a>
                        </div>
                    </LuraschiCard>

                    {/* Botón de WhatsApp */}
                    <LuraschiCard>
                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded transition-colors flex items-center justify-center gap-3 text-lg"
                        >
                            <FaWhatsapp className="text-2xl" />
                            Enviar un WhatsApp
                        </a>
                    </LuraschiCard>
                </div>

                {/* Columna derecha: Mapa - Primero en móvil */}
                <div className="lg:sticky lg:top-24 h-fit order-1 lg:order-2">
                    <LuraschiCard>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">Cómo Llegar</h2>
                        <div className="aspect-square lg:aspect-4/5 w-full rounded overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.7396288906844!2d-58.39586842425614!3d-34.60886095720558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac8e28e31d7%3A0x66e2e4e6e1f8b1d8!2sAv.%20Independencia%202250%2C%20C1225%20CABA!5e0!3m2!1ses-419!2sar!4v1699999999999!5m2!1ses-419!2sar"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación Luraschi Bikes"
                            />
                        </div>
                        <p className="text-sm text-slate-400 mt-3">
                            Ambos locales están sobre Av. Independencia, a pocos metros de distancia
                        </p>
                    </LuraschiCard>
                </div>
            </div>
        </main>
    )
}