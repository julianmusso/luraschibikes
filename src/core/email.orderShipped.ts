import type { EmailRecipient, OrderEmailData } from "@/lib/resend";
import { sendEmail } from "@/lib/resend";

/**
 * EMAIL 3: Pedido enviado
 * Se envía cuando se actualiza el estado a "shipped" y se agrega tracking
 */
export async function sendOrderShippedEmail(
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
                <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🚚 ¡Tu Pedido Va en Camino!</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">¡Hola ${orderData.customerName}!</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Tu pedido <strong style="color: #8b5cf6;">${orderData.orderNumber}</strong> ya salió de nuestro depósito 
                        y está en camino a tu domicilio.
                    </p>

                    ${orderData.trackingNumber ? `
                    <div style="background-color: #ede9fe; border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0 0 8px 0; color: #5b21b6; font-weight: 600;">📦 Código de Seguimiento:</p>
                        <p style="margin: 0; color: #5b21b6; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold;">
                            ${orderData.trackingNumber}
                        </p>
                    </div>
                    ` : ''}

                    ${orderData.shippingAddress ? `
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 24px 0;">
                        <h4 style="margin: 0 0 8px 0; color: #475569;">📍 Dirección de Entrega:</h4>
                        <p style="margin: 0; color: #64748b;">${orderData.shippingAddress}</p>
                    </div>
                    ` : ''}

                    <!-- Botón CTA -->
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${orderData.orderUrl}" style="background-color: #8b5cf6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                            Ver Estado del Pedido
                        </a>
                    </div>

                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; text-align: center;">
                        Estimamos que llegará en los próximos 3-7 días hábiles.
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
        purpose: 'order_shipped',
        subject: `🚚 Tu Pedido ${orderData.orderNumber} Está en Camino`,
        html
    });
}