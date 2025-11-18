import type { EmailRecipient } from "@/lib/resend";
import { sendEmail } from "@/lib/resend";

/**
 * EMAIL 7: Formulario de contacto (confirmación al cliente)
 * Se envía cuando alguien completa el formulario de contacto
 */
export async function sendContactFormConfirmationEmail(
    recipient: EmailRecipient,
    contactData: { message: string; subject: string }
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
                    <h1 style="color: white; margin: 0; font-size: 28px;">📧 Mensaje Recibido</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Gracias por contactarnos, ${recipient.nombre}!</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Recibimos tu mensaje y te responderemos a la brevedad. A continuación, una copia de tu consulta:
                    </p>

                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 24px 0;">
                        <p style="margin: 0 0 12px 0; color: #475569; font-weight: 600;">Asunto:</p>
                        <p style="margin: 0 0 20px 0; color: #1e293b;">${contactData.subject}</p>
                        
                        <p style="margin: 0 0 12px 0; color: #475569; font-weight: 600;">Mensaje:</p>
                        <p style="margin: 0; color: #1e293b; white-space: pre-wrap;">${contactData.message}</p>
                    </div>

                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                        Nuestro equipo revisará tu consulta y te responderá en las próximas <strong>24-48 horas</strong>.
                    </p>

                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; text-align: center;">
                        Si necesitás una respuesta más rápida, podés escribirnos por WhatsApp.
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
        purpose: 'contact_form',
        subject: `✅ Recibimos tu Mensaje - ${contactData.subject}`,
        html
    });
}