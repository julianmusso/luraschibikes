/**
 * Formatea un pedido completo para enviar por WhatsApp
 * Genera un mensaje estructurado con productos, cantidades, precios y total
 */

type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

type OrderFormatOptions = {
    includeGreeting?: boolean;
    storeName?: string;
};

export function formatOrderForWhatsApp(
    items: OrderItem[],
    options: OrderFormatOptions = {}
): string {
    const { includeGreeting = true, storeName = "Luraschi Bikes" } = options;

    let message = "";

    // Saludo inicial
    if (includeGreeting) {
        message += `*Hola!* 👋\n`;
        message += `Me gustaría realizar el siguiente pedido desde *${storeName}*:\n\n`;
    }

    // Encabezado de productos
    message += `═══════════════════════\n`;
    message += `📦 *DETALLE DEL PEDIDO*\n`;
    message += `═══════════════════════\n\n`;

    // Lista de productos
    items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `*${index + 1}. ${item.name}*\n`;
        message += `   ├ Cantidad: *${item.quantity} unidad${item.quantity > 1 ? 'es' : ''}*\n`;
        message += `   ├ Precio unitario: _$${item.price.toLocaleString('es-AR')}_\n`;
        message += `   └ Subtotal: *$${itemTotal.toLocaleString('es-AR')}*\n\n`;
    });

    // Calcular total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Resumen
    message += `═══════════════════════\n`;
    message += `💰 *RESUMEN DEL PEDIDO*\n`;
    message += `═══════════════════════\n`;
    message += `📊 Total de productos: *${totalItems}*\n`;
    message += `💵 *TOTAL A PAGAR: $${total.toLocaleString('es-AR')}*\n\n`;

    // Cierre
    message += `¿Podrían confirmarme *disponibilidad* y *formas de pago*? 🚴‍♂️\n`;
    message += `¡Muchas gracias!`;

    return message;
}
