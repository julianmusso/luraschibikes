import { Resend } from 'resend';

// Inicializar Resend con API key
export const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración del remitente por defecto
const DEFAULT_FROM = {
    email: 'pedidos@luraschibikes.com.ar',
    name: 'Luraschi Bikes'
};

// Tipos
export type EmailRecipient = {
    email: string;
    nombre: string;
};

type EmailPurpose = 
    | 'order_confirmation'      // Confirmación de pedido creado
    | 'payment_confirmed'       // Pago confirmado
    | 'order_processing'        // Pedido en preparación
    | 'order_shipped'           // Pedido enviado
    | 'order_delivered'         // Pedido entregado
    | 'order_cancelled'         // Pedido cancelado
    | 'payment_refunded'        // Reembolso procesado
    | 'stock_insufficient'      // Stock insuficiente (refund automático)
    | 'welcome'                 // Bienvenida al registrarse
    | 'contact_form';           // Formulario de contacto

export type OrderEmailData = {
    orderNumber: string;
    orderUrl: string;
    customerName: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    shippingAddress?: string;
    trackingNumber?: string;
};

/**
 * Función base para enviar emails con Resend
 * Reutilizable para todos los tipos de emails
 */
export async function sendEmail({
    recipient,
    purpose,
    subject,
    html,
    from = DEFAULT_FROM
}: {
    recipient: EmailRecipient;
    purpose: EmailPurpose;
    subject: string;
    html: string;
    from?: { email: string; name: string };
}) {
    try {
        const { data, error } = await resend.emails.send({
            from: `${from.name} <${from.email}>`,
            to: recipient.email,
            subject,
            html,
            tags: [
                { name: 'purpose', value: purpose },
                { name: 'customer', value: recipient.nombre }
            ]
        });

        if (error) {
            console.error(`[Resend Error - ${purpose}]:`, error);
            return { success: false, error };
        }

        console.log(`✅ Email enviado - ${purpose} - ${recipient.email} - ID: ${data?.id}`);
        return { success: true, data };

    } catch (error) {
        console.error(`[Resend Exception - ${purpose}]:`, error);
        return { success: false, error };
    }
}