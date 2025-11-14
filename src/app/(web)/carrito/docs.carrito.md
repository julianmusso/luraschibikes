# Página del Carrito de Compras

## Descripción General

Componente cliente que gestiona el carrito de compras del usuario. Permite visualizar productos agregados, modificar cantidades, eliminar items y proceder al checkout o realizar pedidos por WhatsApp.

## Arquitectura

### Tipo de Componente
- **Client Component** (`'use client'`)
- Requiere interactividad del navegador (localStorage, eventos)

### Almacenamiento
- **localStorage**: Persiste los items del carrito (`{id, quantity}`)
- **Sincronización cross-tab**: Utiliza eventos `storage` y `cartUpdated` para mantener consistencia entre pestañas

## Estado del Componente

```typescript
const [cartItems, setCartItems] = useState<{id: string, quantity: number}[]>([])
const [products, setProducts] = useState<CartProduct[]>([])
const [loading, setLoading] = useState(true)
```

- **cartItems**: IDs y cantidades desde localStorage
- **products**: Datos completos de productos (nombre, precio, imagen) desde Sanity
- **loading**: Estado de carga inicial

## Flujo de Funcionamiento

### 1. Carga Inicial

```
useEffect → handleCartUpdate() → loadCart()
  ├─ getCart() → Lee localStorage
  ├─ getCartProducts(ids) → Fetch a Sanity (Server Action)
  └─ setCartItems() + setProducts()
```

### 2. Sincronización de Eventos

El componente escucha dos eventos:

- **`cartUpdated`**: Emitido por funciones de `@/lib/cart` al modificar el carrito
- **`storage`**: Disparado por el navegador cuando otra pestaña modifica localStorage

Ambos eventos ejecutan `loadCart()` para refrescar los datos.

### 3. Acciones del Usuario

#### Modificar Cantidad
```typescript
handleUpdateQuantity(productId, newQuantity)
  └─ updateQuantity() → Modifica localStorage + emite 'cartUpdated'
      └─ Listener detecta evento → loadCart() → Refresh completo
```

**Nota**: Cada click hace un nuevo fetch a Sanity (posible optimización futura).

#### Eliminar Producto
```typescript
handleRemove(productId)
  └─ removeFromCart() → Elimina de localStorage + emite 'cartUpdated'
      └─ loadCart() → Actualiza vista
```

#### Vaciar Carrito
```typescript
handleClearCart()
  └─ confirm() → clearCart() → localStorage.removeItem()
      └─ setCartItems([]) + setProducts([]) directamente
```

## Funciones Clave

### `loadCart()`
- Lee el carrito desde localStorage
- Fetch a Sanity para obtener datos de productos
- Actualiza ambos estados (`cartItems` y `products`)

### `getProductQuantity(productId)`
- Helper para obtener la cantidad de un producto específico
- Busca en `cartItems` local

### `generateWhatsAppMessage()`
- Formatea el pedido usando `formatOrderForWhatsApp()`
- Genera mensaje estructurado con productos, cantidades y totales
- Utilizado por el botón "Comprar por WhatsApp"

## Estados de Renderizado

### Loading
Muestra skeleton de carga mientras se obtienen los datos iniciales.

### Carrito Vacío
- Muestra icono y mensaje
- Link para ir a la tienda

### Carrito Con Productos
Renderiza dos columnas:

**Columna Izquierda (2/3)**:
- Lista de productos con imagen, nombre, precio
- Controles de cantidad (+/-)
- Botón eliminar por producto
- Botón "Vaciar carrito"

**Columna Derecha (1/3 sticky)**:
- Resumen del pedido (subtotal, total)
- Botón "Finalizar Compra" → `/checkout`
- Botón "Comprar por WhatsApp" → Abre WhatsApp con mensaje formateado
- Link "Seguir comprando" → `/tienda`

## Dependencias

### Librerías
- `@/lib/cart`: Funciones de gestión del carrito (getCart, updateQuantity, removeFromCart, clearCart)
- `@/core/server.getCartProducts`: Server Action que fetch datos de Sanity
- `@/lib/helpers/whatsapp`: Genera links de WhatsApp
- `@/lib/helpers/formatOrderForWhatsapp`: Formatea mensajes estructurados

### Componentes UI
- `LuraschiCard`: Contenedor con estilos de la marca
- `PageTitle`: Título de página con subtitle opcional
- `react-icons/fa`: Iconos (FaTrash, FaShoppingCart, FaWhatsapp)

## Cálculos

### Subtotal
```typescript
products.reduce((sum, product) => {
    const quantity = getProductQuantity(product.id)
    return sum + (product.price * quantity)
}, 0)
```

## Optimizaciones Posibles

1. **Caché de productos**: Los datos de productos no cambian entre clicks de cantidad. Podría cachearse para evitar fetches repetidos.

2. **Debouncing**: Aplicar debounce a `loadCart()` para evitar múltiples fetches rápidos.

3. **Separar lógica de sync**: Solo recargar productos cuando cambian los IDs, no las cantidades.

## Flujo de Compra

```
Carrito → Dos opciones:
  ├─ Finalizar Compra → /checkout (Formulario completo)
  └─ WhatsApp → Mensaje formateado con pedido
```
