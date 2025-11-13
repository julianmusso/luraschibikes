import { getWhatsAppLink } from "@/lib/helpers/whatsapp";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

export function ProductWhatsApp_Component({ productName }: { productName: string }) {
    
    const message = `Hola! Estoy interesado en el producto: ${productName}`;
    const walink = getWhatsAppLink(message);

    return (
        <Link href={walink} className="flex items-center px-4 py-2.5 bg-green-500 rounded-lg">
            <span className="text-white font-semibold">
                <FaWhatsapp size={20} className="inline mr-2" />
                Consultar por Whatsapp
            </span>
        </Link>
    );
}