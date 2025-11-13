import { LURASCHI_BIKES_WHATSAPP } from "../constants/luraschibikes";

/**
 * Genera un link de WhatsApp con mensaje predeterminado.
 * @param message Mensaje a enviar (opcional)
 * @returns URL completa de WhatsApp Web
 */
export function getWhatsAppLink(message?: string): string {
    const defaultMessage = message || "Hola! Me gustaría consultar sobre los productos de Luraschi Bikes.";
    // encodeURIComponent + reemplazar %20 por + para mejor compatibilidad con WhatsApp
    const encodedMessage = encodeURIComponent(defaultMessage).replace(/%20/g, '+');
    return `https://wa.me/${LURASCHI_BIKES_WHATSAPP}?text=${encodedMessage}`;
}
