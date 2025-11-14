# Página de Contacto y Ubicación

## Descripción General

Página estática que muestra información de contacto, ubicación de locales físicos y mapa interactivo. Facilita la comunicación directa con los clientes a través de múltiples canales (WhatsApp, teléfono, email).

## Arquitectura

### Tipo de Componente
- **Server Component** (por defecto en Next.js App Router)
- No requiere interactividad del lado del cliente
- Renderizado del lado del servidor para mejor SEO

### Contenido Estático
Todos los datos se importan desde constantes centralizadas en `@/lib/constants/luraschibikes`:
- `LURASCHI_BIKES_ADDRESS_1`: Dirección del local principal
- `LURASCHI_BIKES_ADDRESS_2`: Dirección de la sucursal
- `LURASCHI_BIKES_PHONE`: Número de teléfono formateado
- `LURASCHI_BIKES_WHATSAPP`: Número de WhatsApp (formato internacional)
- `LURASCHI_BIKES_EMAIL`: Email de contacto

## Estructura de Layout

### Diseño Responsivo (Grid 2 Columnas)

**Desktop (lg:)**
```
┌─────────────────┬─────────────────┐
│   Información   │      Mapa       │
│   (Locales)     │   (Sticky)      │
│   (Contacto)    │                 │
│   (WhatsApp)    │                 │
└─────────────────┴─────────────────┘
```

**Mobile:**
```
┌─────────────────┐
│      Mapa       │  (Primero)
├─────────────────┤
│   Información   │  (Segundo)
│   (Locales)     │
│   (Contacto)    │
│   (WhatsApp)    │
└─────────────────┘
```

Utiliza `order-1` y `order-2` con responsive para invertir el orden visual en mobile.

## Secciones

### 1. Nuestros Locales
Muestra dos locales físicos con:
- **Nombre**: "Local Principal" y "Sucursal"
- **Dirección**: Con icono de ubicación (FaMapMarkerAlt)
- **Horarios**: Lun a Vie y Sábados (FaClock)

Separados visualmente con borde inferior.

### 2. Contacto Directo
Tres métodos de contacto con enlaces activos:

#### WhatsApp
```typescript
href={getWhatsAppLink()}
```
- Abre WhatsApp Web/App con mensaje predeterminado
- Icono verde (FaWhatsapp)
- Hover verde

#### Teléfono
```typescript
href={`tel:${LURASCHI_BIKES_WHATSAPP}`}
```
- Inicia llamada telefónica en dispositivos compatibles
- Icono azul (FaPhone)

#### Email
```typescript
href={`mailto:${LURASCHI_BIKES_EMAIL}`}
```
- Abre cliente de correo del usuario
- Icono azul (FaEnvelope)

### 3. Botón de WhatsApp Destacado
Card independiente con botón grande verde para contacto rápido por WhatsApp.

### 4. Mapa Interactivo (Google Maps)

#### Implementación
```html
<iframe src="https://www.google.com/maps/embed?pb=..." />
```

#### Configuración del Embed
- **URL**: Google Maps Embed API
- **Ubicación**: Av. Independencia 2250, CABA
- **Aspect Ratio**: 
  - Mobile: `aspect-square` (1:1)
  - Desktop: `aspect-4/5` (más alto)
- **Loading**: `lazy` (carga diferida)
- **allowFullScreen**: Permite pantalla completa
- **referrerPolicy**: `no-referrer-when-downgrade`

#### Sticky Behavior
En desktop, el mapa tiene `lg:sticky lg:top-24` para que permanezca visible al hacer scroll.

## Funciones Helper

### `getWhatsAppLink(message?)`
Importado de `@/lib/helpers/whatsapp`:
- Genera URL de WhatsApp con número predeterminado
- Acepta mensaje opcional (usa mensaje default si no se proporciona)
- Formato: `https://wa.me/{numero}?text={mensaje}`

## Componentes UI Utilizados

### `PageTitle`
```typescript
<PageTitle 
  title="Contacto y Ubicación"
  subtitle="Visitanos en nuestros locales..." 
/>
```

### `LuraschiCard`
Contenedor estilizado que envuelve cada sección:
- Fondo oscuro semitransparente
- Padding consistente
- Bordes redondeados

### Iconos (react-icons/fa)
- `FaMapMarkerAlt`: Ubicación
- `FaPhone`: Teléfono
- `FaEnvelope`: Email
- `FaWhatsapp`: WhatsApp
- `FaClock`: Horarios

## Estilos y Estados Interactivos

### Hover States
```typescript
hover:text-green-400  // WhatsApp
hover:text-blue-400   // Teléfono y Email
hover:bg-green-500    // Botón WhatsApp
```

### Colores de Marca
- **Azul**: `text-blue-400` (títulos, iconos principales)
- **Verde**: `text-green-400`, `bg-green-600` (WhatsApp)
- **Slate**: `text-slate-300`, `border-slate-700` (texto secundario)

## Accesibilidad

### Enlaces Semánticos
- `target="_blank"` con `rel="noopener noreferrer"` para links externos
- Protocolos nativos: `tel:`, `mailto:`, `https://wa.me/`

### iframe
- `title="Ubicación Luraschi Bikes"` para lectores de pantalla
- `allowFullScreen` para mejor UX

## SEO

### Beneficios del Server Component
- HTML completo en primera carga
- Información de contacto indexable
- Datos estructurados implícitos (direcciones, teléfonos)

### Posibles Mejoras
Agregar Schema.org markup para:
```json
{
  "@type": "LocalBusiness",
  "address": {...},
  "telephone": "...",
  "openingHours": "Mo-Fr 09:00-19:00, Sa 09:00-13:00"
}
```

## Información Mostrada

### Horarios
- **Lunes a Viernes**: 9:00 - 19:00
- **Sábados**: 9:00 - 13:00

Aplicable a ambos locales (hardcodeado actualmente).

### Nota Aclaratoria
"Ambos locales están sobre Av. Independencia, a pocos metros de distancia"

Ayuda al usuario a entender la proximidad de las ubicaciones.

## Flujo de Usuario

```
Usuario llega a /contacto
  ├─ Ver mapa (primera impresión en mobile)
  ├─ Leer direcciones y horarios
  ├─ Elegir método de contacto:
  │   ├─ Click en WhatsApp → Abre chat
  │   ├─ Click en teléfono → Inicia llamada
  │   └─ Click en email → Abre cliente correo
  └─ Usar mapa para llegar físicamente
```

## Dependencias

### Externas
- Google Maps Embed API (sin API key necesaria para embed básico)
- react-icons/fa

### Internas
- `@/lib/constants/luraschibikes`: Datos centralizados
- `@/lib/helpers/whatsapp`: Generación de links
- `@/components/ui/*`: Componentes de diseño

## Mantenimiento

### Actualizar Información
Editar constantes en `@/lib/constants/luraschibikes.ts`:
```typescript
export const LURASCHI_BIKES_ADDRESS_1 = "Nueva dirección";
export const LURASCHI_BIKES_PHONE = "Nuevo teléfono";
```

### Cambiar Ubicación del Mapa
1. Ir a Google Maps
2. Buscar la dirección
3. Click en "Compartir" → "Insertar un mapa"
4. Copiar el iframe src
5. Reemplazar en el componente
