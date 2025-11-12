/**
 * GESTIÓN DEL CARRITO DE COMPRAS
 * 
 * En primera instancia le pregunté a Copilot cómo hacer esto porque yo iba a usar Cookies,
 * y quería saber si existía una forma mejor de armar el carrito. Primero toqué el localstorage
 * pero pensé en qué sucedería si el usuario estuviera en múltiples pestañas abiertas. Primero pensé que el localstorage
 * se compartiría ya que al ser más de backend no tengo mucha idea, pero aprendí (gracias a Copilot) que no,
 * y que puede jugar con los disparadores de navegador para la sincronización. Las siguientes preguntas
 * fueron hechas por Copilot y respondidas por mi para tener una visión clara de las decisiones tomadas.
 * 
 * DECISIONES DE ARQUITECTURA:
 * 
 * 1. ¿Por qué localStorage en lugar de estado global (Redux/Zustand)?
 *    - Persistencia nativa: El carrito sobrevive a recargas de página
 *    - Sin dependencias extra: No necesitamos librerías de estado global
 *    - API simple: localStorage es síncrono y directo
 *    - Compatible con SSR: Se valida typeof window !== 'undefined'
 * 
 * 2. ¿Por qué no guardar datos del producto (nombre, precio) en localStorage?
 *    - Evita datos obsoletos: Precios/stock pueden cambiar.
 *    - Source of truth único: Sanity CMS es la única fuente.
 *    - Menos espacio: Solo guardamos ID + cantidad.
 *    - Seguridad: El precio se valida en el servidor al checkout.
 * 
 * 3. ¿Cómo se sincronizan múltiples pestañas?
 *    - Evento 'storage': El navegador dispara este evento cuando OTRA pestaña
 *      modifica localStorage. Esto permite sincronización cross-tab.
 *    - Evento 'cartUpdated': Custom event para actualizar la MISMA pestaña.
 *      inmediatamente sin esperar al ciclo de storage.
 * 
 * 4. ¿Por qué leer getCart() en cada función en lugar de caché?
 *    - Evita race conditions: Si dos pestañas modifican simultáneamente,
 *      siempre partimos desde el estado más reciente en localStorage.
 *    - Consistencia garantizada: No hay estado "stale" en memoria.
 * 
 * FLUJO DE DATOS:
 * 1. El Usuario agrega un producto → addToCart() actualiza localStorage.
 * 2. Se dispara evento 'cartUpdated' (en la misma pestaña).
 * 3. Se dispara evento 'storage' (en otras pestañas). <--- acá está el truco jeje
 * 4. Componente Cart_Component escucha ambos eventos y re-renderiza
 * 5. Se hace fetch a Sanity para obtener datos frescos (nombre, precio, imagen).
 * 
 * Si no usara Cookies, podía usar estados globales, pero siento que Zustand es overkill para esto.
 * Ni hablar de Redux, que sería demasiado ya.
 * La opción fue usar eventos de navegador, me pareció adecuada.
 */

type CartItem = {
    id: string;
    quantity: number;
}

export function getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
}

export function saveCart(cart: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId: string, quantity: number = 1): CartItem[] {

    // IMPORTANTE: Siempre leer el estado fresco del localStorage
    // Esto previene race conditions si dos pestañas modifican el carrito simultáneamente.
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Producto ya existe: incrementar cantidad en lugar de duplicar
        existingItem.quantity += quantity;
    } else {
        // Producto nuevo: agregar al array
        cart.push({ id: productId, quantity });
    }

    saveCart(cart);
    
    // Notificar a los componentes que el carrito cambió
    // Este evento permite que el header actualice el badge sin polling
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
    }
    
    return cart;
}

export function removeFromCart(productId: string): CartItem[] {
    // Siempre leer el estado fresco
    const cart = getCart();
    const filtered = cart.filter(item => item.id !== productId);
    saveCart(filtered);
    
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
    }
    
    return filtered;
}

export function updateQuantity(productId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
        return removeFromCart(productId);
    }

    // Siempre leer el estado fresco
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }

    return cart;
}

export function clearCart(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cart');
}
