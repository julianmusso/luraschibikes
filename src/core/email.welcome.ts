import type { EmailRecipient } from "@/lib/resend";
import { sendEmail } from "@/lib/resend";

/**
 * EMAIL 6: Email de bienvenida
 * Se envía cuando un usuario se registra con Google
 */
export async function sendWelcomeEmail(
    recipient: EmailRecipient
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
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px;">🚴‍♂️ Bienvenido a Luraschi Bikes</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">¡Hola ${recipient.nombre}!</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Nos alegra tenerte en nuestra comunidad de ciclistas. En Luraschi Bikes encontrarás las mejores 
                        bicicletas y accesorios para tus aventuras sobre ruedas.
                    </p>

                    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #1e40af; font-size: 15px;">
                            <strong>💡 Tip:</strong> Explorá nuestro catálogo y agregá productos a tu carrito. 
                            Cuando estés listo, completá tu compra de forma rápida y segura.
                        </p>
                    </div>

                    <h3 style="color: #1e293b; margin-top: 32px;">¿Qué podés hacer ahora?</h3>
                    <ul style="color: #64748b; line-height: 1.8; padding-left: 20px;">
                        <li>🛍️ Explorá nuestra <strong>tienda online</strong></li>
                        <li>📦 Hacé seguimiento de tus pedidos</li>
                        <li>💬 Contactanos por WhatsApp para consultas</li>
                        <li>📍 Visitá nuestro local físico</li>
                    </ul>

                    <!-- Botón CTA -->
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="https://luraschibikes.com.ar/tienda" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; margin: 0 8px 8px 0;">
                            Ver Productos
                        </a>
                        <a href="https://luraschibikes.com.ar/contacto" style="background-color: #64748b; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; margin: 0 8px 8px 0;">
                            Contacto
                        </a>
                    </div>

                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; text-align: center;">
                        ¡Que disfrutes pedalear con Luraschi Bikes! 🚴‍♂️
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
        purpose: 'welcome',
        subject: '🚴‍♂️ ¡Bienvenido a Luraschi Bikes!',
        html
    });
}