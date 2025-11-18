import { defineField, defineType } from 'sanity'

export const productType = defineType({
    name: 'product',
    title: 'Producto',
    type: 'document',
    fields: [
        // Información básica
        defineField({
            name: 'name',
            title: 'Nombre del producto',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL amigable',
            type: 'slug',
            options: { source: 'name' },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'brand',
            title: 'Marca',
            type: 'string',
            description: 'Ej: Shimano, SRAM, Campagnolo, etc.',
        }),
        defineField({
            name: 'badge',
            title: 'Etiqueta',
            type: 'string',
            description: 'Aparece destacada en la imagen del producto',
            options: {
                list: [
                    { title: 'Ninguna', value: '' },
                    { title: 'Nuevo', value: 'new' },
                    { title: 'Oferta', value: 'sale' },
                    { title: 'Más vendido', value: 'bestseller' },
                    { title: 'Agotándose', value: 'low-stock' },
                ],
            },
        }),
        
        // Imágenes
        defineField({
            name: 'images',
            title: 'Galería de imágenes',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Texto alternativo',
                        },
                    ],
                },
            ],
            validation: (rule) => rule.required().min(1),
        }),
        
        // Precio y stock
        defineField({
            name: 'price',
            title: 'Precio',
            type: 'number',
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: 'salePrice',
            title: 'Precio de oferta',
            type: 'number',
            validation: (rule) => rule.min(0),
        }),
        defineField({
            name: 'sku',
            title: 'SKU',
            type: 'string',
        }),
        defineField({
            name: 'stock',
            title: 'Stock disponible',
            type: 'number',
            validation: (rule) => rule.required().min(0),
            initialValue: 0,
        }),
        defineField({
            name: 'lowStockThreshold',
            title: 'Alerta de stock bajo',
            type: 'number',
            description: 'Mostrar alerta cuando el stock sea menor a este número',
            initialValue: 5,
        }),
        
        // Estado
        defineField({
            name: 'status',
            title: 'Estado',
            type: 'string',
            options: {
                list: [
                    { title: 'Borrador', value: 'draft' },
                    { title: 'Publicado', value: 'published' },
                    { title: 'Archivado', value: 'archived' },
                ],
            },
            initialValue: 'draft',
            validation: (rule) => rule.required(),
        }),
        
        // Categorías
        defineField({
            name: 'categories',
            title: 'Categorías',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        
        // Especificaciones técnicas
        defineField({
            name: 'specifications',
            title: 'Especificaciones técnicas',
            description: 'Selecciona la característica y escribe su valor. Marca "Destacada" para mostrar en el panel de compra (máx 6)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'feature',
                            title: 'Característica',
                            type: 'reference',
                            to: [{ type: 'feature' }],
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'value',
                            title: 'Valor',
                            type: 'string',
                            description: 'Ej: 250g, Aluminio, 26"',
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'featured',
                            title: 'Destacada',
                            description: 'Aparece en el panel de compra',
                            type: 'boolean',
                            initialValue: false,
                        },
                    ],
                    preview: {
                        select: {
                            featureName: 'feature.name',
                            value: 'value',
                            featured: 'featured',
                        },
                        prepare({ featureName, value, featured }) {
                            return {
                                title: `${featureName}: ${value}`,
                                subtitle: featured ? '⭐ Destacada' : '',
                            }
                        },
                    },
                },
            ],
        }),
        
        // Compatibilidad
        defineField({
            name: 'compatibility',
            title: 'Compatibilidad',
            description: 'Con qué modelos o tipos de bicicletas es compatible',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        
        // Variaciones
        defineField({
            name: 'variations',
            title: 'Variaciones',
            description: 'Si el producto tiene variaciones (color, talla, etc.). Dejar vacío para producto simple.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'sku',
                            title: 'SKU',
                            type: 'string',
                            description: 'SKU específico de esta variación',
                        },
                        {
                            name: 'attributes',
                            title: 'Atributos',
                            type: 'array',
                            description: 'Selecciona los atributos de esta variación',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        {
                                            name: 'attribute',
                                            title: 'Atributo',
                                            type: 'reference',
                                            to: [{ type: 'attribute' }],
                                            validation: (rule) => rule.required(),
                                        },
                                        {
                                            name: 'valueLabel',
                                            title: 'Valor',
                                            type: 'string',
                                            description: 'Escribe el valor exactamente como está en el atributo (ej: "Rojo", "M")',
                                            validation: (rule) => rule.required(),
                                        },
                                    ],
                                    preview: {
                                        select: {
                                            attributeName: 'attribute.name',
                                            value: 'valueLabel',
                                        },
                                        prepare({ attributeName, value }) {
                                            return {
                                                title: `${attributeName}: ${value}`,
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: 'price',
                            title: 'Precio (opcional)',
                            type: 'number',
                            description: 'Si no se especifica, usa el precio general del producto',
                            validation: (rule) => rule.min(0),
                        },
                        {
                            name: 'stock',
                            title: 'Stock',
                            type: 'number',
                            validation: (rule) => rule.required().min(0),
                            initialValue: 0,
                        },
                        {
                            name: 'image',
                            title: 'Imagen (opcional)',
                            type: 'image',
                            description: 'Imagen específica para esta variación. Si no se especifica, usa las imágenes generales.',
                            options: { hotspot: true },
                        },
                    ],
                    preview: {
                        select: {
                            attributes: 'attributes',
                            stock: 'stock',
                            price: 'price',
                            media: 'image',
                        },
                        prepare({ attributes, stock, price, media }) {
                            const attrs = attributes && attributes.length > 0
                                ? attributes
                                    .map((attr: { attribute?: { name?: string }, valueLabel?: string }) => 
                                        `${attr.attribute?.name || '?'}: ${attr.valueLabel || '?'}`
                                    )
                                    .join(', ')
                                : 'Sin atributos'
                            
                            return {
                                title: attrs,
                                subtitle: `Stock: ${stock}${price ? ` | Precio: $${price}` : ''}`,
                                media,
                            }
                        },
                    },
                },
            ],
        }),
        
        // Productos relacionados
        defineField({
            name: 'relatedProducts',
            title: 'Productos relacionados',
            description: 'Productos que se pueden mostrar como sugerencias',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
        }),
        
        // SEO
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                {
                    name: 'metaTitle',
                    title: 'Meta título',
                    type: 'string',
                    validation: (rule) => rule.max(60),
                },
                {
                    name: 'metaDescription',
                    title: 'Meta descripción',
                    type: 'text',
                    validation: (rule) => rule.max(160),
                },
            ],
            options: {
                collapsible: true,
                collapsed: true,
            },
        }),
    ],
    preview: {
        select: {
            title: 'name',
            price: 'price',
            status: 'status',
            media: 'images.0',
        },
        prepare({ title, price, status, media }) {
            return {
                title,
                subtitle: `$${price} - ${status === 'published' ? 'Publicado' : status === 'draft' ? 'Borrador' : 'Archivado'}`,
                media,
            }
        },
    },
})
