import type { EmailRecipient } from "@/lib/resend";
import { sendEmail } from "@/lib/resend";

/**
 * EMAIL 5: Reembolso procesado
 * Se envía cuando se procesa un refund por stock insuficiente u otro motivo
 */
export async function sendPaymentRefundedEmail(
    recipient: EmailRecipient,
    orderData: { orderNumber: string; orderUrl: string; customerName: string; amount: number; reason: string }
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
                <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">💸 Reembolso Procesado</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Hola ${orderData.customerName},</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Lamentamos informarte que tu pedido <strong style="color: #f97316;">${orderData.orderNumber}</strong> 
                        no pudo ser procesado y hemos iniciado el reembolso.
                    </p>

                    <div style="background-color: #ffedd5; border-left: 4px solid #f97316; padding: 16px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0 0 8px 0; color: #9a3412; font-weight: 600;">Motivo del Reembolso:</p>
                        <p style="margin: 0; color: #9a3412;">${orderData.reason}</p>
                    </div>

                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 24px 0; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Monto Reembolsado:</p>
                        <p style="margin: 0; color: #1e293b; font-size: 28px; font-weight: bold;">
                            $${orderData.amount.toLocaleString('es-AR')}
                        </p>
                    </div>

                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        El reembolso aparecerá en tu medio de pago en los próximos <strong>5 a 10 días hábiles</strong>, 
                        dependiendo de tu banco o entidad emisora.
                    </p>

                    <!-- Botón CTA -->
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="https://luraschibikes.com.ar/tienda" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                            Seguir Comprando
                        </a>
                    </div>

                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; text-align: center;">
                        Lamentamos las molestias. Si tenés consultas, no dudes en contactarnos.
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
        purpose: 'payment_refunded',
        subject: `💸 Reembolso Procesado - Pedido ${orderData.orderNumber}`,
        html
    });
}