import type { EmailRecipient } from "@/lib/resend";
import { sendEmail } from "@/lib/resend";

/**
 * EMAIL 4: Pedido cancelado
 * Se envía cuando se cancela una orden
 */
export async function sendOrderCancelledEmail(
    recipient: EmailRecipient,
    orderData: { orderNumber: string; orderUrl: string; customerName: string; reason?: string }
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
                <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">❌ Pedido Cancelado</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Hola ${orderData.customerName},</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Tu pedido <strong style="color: #ef4444;">${orderData.orderNumber}</strong> ha sido cancelado.
                    </p>

                    ${orderData.reason ? `
                    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #991b1b; font-size: 14px;">
                            <strong>Motivo:</strong> ${orderData.reason}
                        </p>
                    </div>
                    ` : ''}

                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Si realizaste un pago, será reembolsado automáticamente en los próximos días.
                    </p>

                    <!-- Botón CTA -->
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="https://luraschibikes.com.ar/tienda" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                            Ver Productos
                        </a>
                    </div>

                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; text-align: center;">
                        Si tenés alguna duda, no dudes en contactarnos.
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
        purpose: 'order_cancelled',
        subject: `❌ Pedido ${orderData.orderNumber} Cancelado`,
        html
    });
}