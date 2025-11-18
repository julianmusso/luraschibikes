import type { EmailRecipient, OrderEmailData } from "@/lib/resend";
import { sendEmail } from "@/lib/resend";

/**
 * EMAIL 1: Confirmación de pedido creado (PENDING)
 * Se envía cuando el usuario completa el checkout y se crea la orden
 */
export async function sendOrderConfirmationEmail(
    recipient: EmailRecipient,
    orderData: OrderEmailData
) {
    const itemsList = orderData.items
        .map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.price.toLocaleString('es-AR')}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">$${(item.price * item.quantity).toLocaleString('es-AR')}</td>
            </tr>
        `).join('');

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
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🚴‍♂️ Luraschi Bikes</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">¡Gracias por tu pedido, ${orderData.customerName}!</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Recibimos tu pedido <strong style="color: #3b82f6;">${orderData.orderNumber}</strong>. 
                        Estamos esperando la confirmación de pago para comenzar a prepararlo.
                    </p>

                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                            <strong>⏳ Pago Pendiente:</strong> Completá el pago desde MercadoPago para que podamos procesar tu pedido.
                        </p>
                    </div>

                    <!-- Detalles del pedido -->
                    <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 32px;">
                        Detalle del Pedido
                    </h3>

                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f1f5f9;">
                                <th style="padding: 12px; text-align: left; color: #475569; font-weight: 600;">Producto</th>
                                <th style="padding: 12px; text-align: center; color: #475569; font-weight: 600;">Cant.</th>
                                <th style="padding: 12px; text-align: right; color: #475569; font-weight: 600;">Precio</th>
                                <th style="padding: 12px; text-align: right; color: #475569; font-weight: 600;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsList}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="padding: 16px 12px; text-align: right; font-weight: bold; color: #1e293b; font-size: 18px;">Total:</td>
                                <td style="padding: 16px 12px; text-align: right; font-weight: bold; color: #3b82f6; font-size: 18px;">$${orderData.total.toLocaleString('es-AR')}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <!-- Botón CTA -->
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${orderData.orderUrl}" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                            Ver Estado del Pedido
                        </a>
                    </div>

                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; text-align: center;">
                        Si tenés alguna consulta, respondé este email o contactanos por WhatsApp.
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
        purpose: 'order_confirmation',
        subject: `✅ Pedido ${orderData.orderNumber} - Esperando Pago`,
        html
    });
}