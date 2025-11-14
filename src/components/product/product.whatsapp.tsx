import { getWhatsAppLink } from "@/lib/helpers/whatsapp";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

export function ProductWhatsApp_Component({ productName }: { productName: string }) {

    const message = `Hola! Estoy interesado en el producto: ${productName}`;
    const walink = getWhatsAppLink(message);

    return (
        <Link
            href={walink}
            className=" bg-green-500 hover:bg-green-600
            text-white font-semibold py-3 px-6 rounded-lg
                transition-all duration-200
                flex items-center gap-2 justify-center"
        >
            <span className="text-white font-semibold">
                <FaWhatsapp size={20} className="inline mr-2" />
                Consultar por Whatsapp
            </span>
        </Link>
    );
}