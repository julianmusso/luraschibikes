# Página de Tienda

## Descripción General

Página principal del catálogo de productos con sistema avanzado de filtrado y búsqueda. Utiliza Server Components con Suspense boundaries para optimizar la carga y renderizado de datos desde Sanity CMS.

## Arquitectura

### Tipo de Componente
- **Server Component** (async page component)
- Composición de múltiples Server Components anidados
- Utiliza **Suspense** para streaming y loading states

### Estructura de Componentes

```
Tienda_Page (Server Component)
├─ FilterPanel (Server Component)
│  └─ ProductFilters (Client Component)
└─ ProductList (Server Component)
   └─ ProductCard[] (Server Component)
```

## Flujo de Datos

### 1. searchParams → Filters

```typescript
searchParams: Promise<{[key: string]: string | string[] | undefined}>
  ↓
filters: Promise<Filters>
  ↓
resolvedFilters: Filters
```

En Next.js 15+, `searchParams` es una **Promise** que debe resolverse antes de usar.

### 2. Transformación de Parámetros

#### Parámetros Conocidos
```typescript
const knownParams = [
  'page',      // Número de página
  'category',  // Slug de categoría
  'minPrice',  // Precio mínimo
  'maxPrice',  // Precio máximo
  'search',    // Término de búsqueda
  'brand',     // Marca
  'sort'       // Ordenamiento
]
```

#### Atributos Dinámicos
Cualquier parámetro que NO esté en `knownParams` se trata como atributo filtrable:

```typescript
// Ejemplo URL:
// /tienda?tipo-freno=hidraulico,disco&material=aluminio

attributes = {
  "tipo-freno": ["hidraulico", "disco"],
  "material": ["aluminio"]
}
```

Los valores se dividen por comas para permitir selección múltiple.

### 3. Construcción del Objeto Filters

```typescript
{
  page: number | undefined,
  category: string | undefined,
  minPrice: number | undefined,
  maxPrice: number | undefined,
  search: string | undefined,
  brand: string | undefined,
  sort: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc',
  attributes: Record<string, string[]> | undefined
}
```

## Layout de la Página

### Grid Responsivo (7 columnas)

**Desktop:**
```
┌──────────┬────────────────────────────┐
│ Filtros  │       Productos            │
│ (2/7)    │         (5/7)              │
│          │    Grid 3 columnas         │
└──────────┴────────────────────────────┘
```

**Mobile:**
```
┌────────────────┐
│    Filtros     │ (Stacked)
├────────────────┤
│   Productos    │ (1 columna)
└────────────────┘
```

## Componentes Hijos

### FilterPanel (Server Component)

**Responsabilidad:**
- Fetch de datos para filtros desde Sanity
- Carga paralela con `Promise.all()`

**Datos cargados:**
1. **filterAttributes**: Atributos filtrables dinámicos (ej: tipo de freno, material)
2. **brands**: Marcas disponibles
3. **categories**: Categorías y subcategorías

**Renderiza:**
`<ProductFilters>` (Client Component) con los datos fetched

### ProductList (Server Component)

**Responsabilidad:**
- Recibe `filters` como Promise
- Resuelve la promise con `await filters`
- Llama a `getProducts(resolvedFilters)` para fetch desde Sanity
- Renderiza grid de productos o mensaje de vacío

**Estado Vacío:**
```tsx
<div>No se encontraron productos.</div>
```

**Grid de Productos:**
- 1 columna en mobile (`sm:grid-cols-1`)
- 2 columnas en tablet (`sm:grid-cols-2`)
- 3 columnas en desktop (`xl:grid-cols-3`)

## Suspense Boundaries

### Propósito
Permite **streaming de contenido** progresivo mientras los datos se cargan.

### Implementación

```tsx
<Suspense fallback={<ProductFiltersSkeleton />}>
  <FilterPanel />
</Suspense>

<Suspense fallback={<ProductGridSkeleton count={6} />}>
  <ProductList filters={filters} />
</Suspense>
```

### Beneficios
1. **UX mejorada**: Usuario ve skeleton mientras carga
2. **Performance**: Renderizado progresivo (no bloquea toda la página)
3. **Independencia**: Filtros y productos cargan en paralelo
4. **SEO**: HTML parcial se envía antes del fetch completo

## Filtrado de Productos

### Categorías con Jerarquía
Implementado en `server.getProducts`:
- Usa `getCategoryWithChildren(categorySlug)` para incluir subcategorías
- Ejemplo: Filtrar por "Bicicletas" incluye productos en "MTB", "Ruta", etc.

### Atributos Dinámicos
Valores separados por comas permiten OR lógico:
```
?tipo-freno=hidraulico,disco
→ Productos con freno hidráulico O disco
```

### Búsqueda
Case-insensitive, busca en `name` y `description`:
```groq
name match "${search}*" || description match "${search}*"
```

### Ordenamiento
Opciones disponibles:
- `newest`: Por fecha de creación (desc)
- `oldest`: Por fecha de creación (asc)
- `price-asc`: Precio menor a mayor
- `price-desc`: Precio mayor a menor
- `name-asc`: Nombre A-Z
- `name-desc`: Nombre Z-A

## Paginación

### Implementación
- Parámetro `page` en URL (default: 1)
- `PRODUCTS_PER_PAGE` define cantidad por página
- Cálculo: `start = (page - 1) * PRODUCTS_PER_PAGE`

### Metadata en Response
```typescript
{
  products: Product[],
  total: number,
  page: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}
```

## Server Actions Utilizadas

### `getProducts(filters)`
- Archivo: `@/core/server.getProducts`
- Usa `'use cache'` con `cacheLife({ stale: 3600 })` (1 hora)
- Cache tags dinámicos por categoría
- Query GROQ complejo con filtros condicionales

### `getFilterableAttributes()`
- Archivo: `@/core/server.getFilterableAttributes`
- Retorna atributos configurables en Sanity

### `getBrands()`
- Archivo: `@/core/server.getBrands`
- Lista de marcas únicas

### `getCategories()`
- Archivo: `@/core/server.getCategories`
- Árbol de categorías con jerarquía

## Caché y Revalidación

### Cache Strategy
```typescript
'use cache';
cacheTag(CACHE_TAGS.PRODUCTS_LIST);
cacheLife({ stale: 3600 }); // 1 hora
```

### Cache Tags Dinámicos
Si hay filtro de categoría:
```typescript
cacheTag(CACHE_TAGS.productsByCategory(categorySlug));
```

### Revalidación Manual
```typescript
// Revalidar toda la lista
await revalidateProducts();

// Revalidar por categoría
await revalidateProductsByCategory('bicicletas');
```

## Estados de Carga

### Skeleton Components

**ProductFiltersSkeleton:**
- Simula panel de filtros
- Bloques de shimmer/pulso animados

**ProductGridSkeleton:**
- Recibe `count` como prop (default: 6)
- Grid de cards skeleton
- Mismo layout que productos reales

### Duración Típica
- Filtros: ~200-500ms (caché caliente)
- Productos: ~300-800ms (depende de filtros)

## Navegación y URLs

### Formato de URL
```
/tienda
/tienda?category=bicicletas
/tienda?category=bicicletas&brand=trek&sort=price-asc
/tienda?search=mountain&minPrice=100000&maxPrice=500000
/tienda?tipo-freno=hidraulico&material=carbono
```

### Construcción desde ProductFilters
El componente `<ProductFilters>` usa:
```typescript
const router = useRouter();
const searchParams = useSearchParams();

// Construir nueva URL
const params = new URLSearchParams(searchParams.toString());
params.set('category', categorySlug);
router.push(`/tienda?${params.toString()}`);
```

### Persistencia de Filtros
Al cambiar un filtro, los demás se mantienen en la URL.

## Tipos TypeScript

### ProductFilters
```typescript
interface ProductFilters {
  page?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  brand?: string;
  status?: 'draft' | 'published';
  sort?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  attributes?: Record<string, string[]>;
}
```

## Dependencias

### Core
- Next.js 15+ (App Router con async searchParams)
- React 19 (Suspense mejorado)
- Sanity CMS

### Componentes
- `@/components/product/product.card`: Card de producto
- `@/components/product/product.filters`: Panel de filtros interactivo
- `@/components/product/*.skeleton`: Estados de carga
- `@/components/ui/ui.page.title`: Título de página

### Server Actions
- `@/core/server.getProducts`
- `@/core/server.getFilterableAttributes`
- `@/core/server.getBrands`
- `@/core/server.getCategories`

## Optimizaciones

### Server Components
- Fetch de datos directo en el servidor (sin fetch API)
- Reducción de bundle JS del cliente
- Mejor SEO (contenido en HTML inicial)

### Suspense Streaming
- Renderizado progresivo
- TTFB más bajo
- Mejor Core Web Vitals

### Cache Granular
- Cache por categoría (invalidación selectiva)
- TTL de 1 hora (balance entre frescura y performance)

### Parallel Data Fetching
```typescript
Promise.all([
  getFilterableAttributes(),
  getBrands(),
  getCategories()
])
```

## Flujo de Usuario

```
Usuario entra a /tienda
  ↓
Ve skeletons (ProductGridSkeleton + ProductFiltersSkeleton)
  ↓
Datos cargan en paralelo (Filtros + Productos)
  ↓
Contenido se renderiza progresivamente
  ↓
Usuario interactúa con filtros
  ↓
URL actualizada con nuevos params
  ↓
Navegación → Nueva carga con filtros aplicados
  ↓
Proceso se repite (skeletons → contenido)
```

## Mejoras Futuras

1. **Filtros en URL persisten scroll position**
2. **Infinite scroll** en lugar de paginación tradicional
3. **Prefetching** de próxima página
4. **Filtro por rango de precio** con slider visual
5. **Ordenamiento por relevancia** con búsqueda
6. **Vista de lista vs grid** toggle
