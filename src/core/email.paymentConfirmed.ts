import type { EmailRecipient, OrderEmailData } from "@/lib/resend";
import { sendEmail } from "@/lib/resend";

/**
 * EMAIL 2: Pago confirmado
 * Se envía cuando el webhook de MercadoPago confirma el pago
 */
export async function sendPaymentConfirmedEmail(
    recipient: EmailRecipient,
    orderData: OrderEmailData
) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Pago Confirmado!</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">¡Excelente, ${orderData.customerName}!</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Recibimos el pago de tu pedido <strong style="color: #10b981;">${orderData.orderNumber}</strong>. 
                        Ahora vamos a preparar tus productos para el envío.
                    </p>

                    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #065f46; font-size: 14px;">
                            <strong>✅ Pago Aprobado:</strong> Tu pedido está siendo preparado. Te avisaremos cuando esté listo para enviar.
                        </p>
                    </div>

                    ${orderData.shippingAddress ? `
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 24px 0;">
                        <h4 style="margin: 0 0 8px 0; color: #475569;">📍 Dirección de Envío:</h4>
                        <p style="margin: 0; color: #64748b;">${orderData.shippingAddress}</p>
                    </div>
                    ` : ''}

                    <!-- Botón CTA -->
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${orderData.orderUrl}" style="background-color: #10b981; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                            Ver Estado del Pedido
                        </a>
                    </div>

                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; text-align: center;">
                        Estimamos enviarlo en las próximas 24-48 horas hábiles.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                        © ${new Date().getFullYear()} Luraschi Bikes. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail({
        recipient,
        purpose: 'payment_confirmed',
        subject: `🎉 Pago Confirmado - Pedido ${orderData.orderNumber}`,
        html
    });
}