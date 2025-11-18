import { defineField, defineType } from 'sanity'
import { PackageIcon } from '@sanity/icons'

export const orderType = defineType({
    name: 'order',
    title: 'Pedidos',
    type: 'document',
    icon: PackageIcon,
    fields: [
        // Order Number
        defineField({
            name: 'orderNumber',
            title: 'Número de Pedido',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Formato: ORD-YYYYMMDD-XXX (ej: ORD-20251116-001)',
        }),

        // Order Status
        defineField({
            name: 'status',
            title: 'Estado del Pedido',
            type: 'string',
            options: {
                list: [
                    { title: '⏳ Pendiente', value: 'pending' },
                    { title: '💳 Pago Aprobado', value: 'paid' },
                    { title: '📦 Procesando', value: 'processing' },
                    { title: '🚚 Enviado', value: 'shipped' },
                    { title: '✅ Completado', value: 'completed' },
                    { title: '❌ Cancelado', value: 'cancelled' },
                    { title: '💸 Reembolsado', value: 'refunded' },
                ],
                layout: 'radio',
            },
            initialValue: 'pending',
            validation: (Rule) => Rule.required(),
        }),

        // Customer Information
        defineField({
            name: 'customer',
            title: 'Cliente',
            type: 'object',
            fields: [
                defineField({
                    name: 'email',
                    title: 'Email',
                    type: 'string',
                    validation: (Rule) => Rule.required().email(),
                }),
                defineField({
                    name: 'name',
                    title: 'Nombre Completo',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'phone',
                    title: 'Teléfono',
                    type: 'string',
                }),
                defineField({
                    name: 'dni',
                    title: 'DNI/CUIT',
                    type: 'string',
                }),
            ],
            validation: (Rule) => Rule.required(),
        }),

        // Order Items
        defineField({
            name: 'items',
            title: 'Productos',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'product',
                            title: 'Producto',
                            type: 'reference',
                            to: [{ type: 'product' }],
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'productSnapshot',
                            title: 'Snapshot del Producto',
                            type: 'object',
                            description: 'Datos del producto al momento de la compra',
                            fields: [
                                { name: 'name', title: 'Nombre', type: 'string' },
                                { name: 'sku', title: 'SKU', type: 'string' },
                                { name: 'imageUrl', title: 'Imagen URL', type: 'url' },
                            ],
                        }),
                        defineField({
                            name: 'quantity',
                            title: 'Cantidad',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(1),
                        }),
                        defineField({
                            name: 'unitPrice',
                            title: 'Precio Unitario',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(0),
                        }),
                        defineField({
                            name: 'subtotal',
                            title: 'Subtotal',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(0),
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'productSnapshot.name',
                            quantity: 'quantity',
                            price: 'unitPrice',
                        },
                        prepare({ title, quantity, price }) {
                            return {
                                title: title || 'Producto',
                                subtitle: `Cantidad: ${quantity} × $${price}`,
                            }
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.required().min(1),
        }),

        // Payment Information
        defineField({
            name: 'payment',
            title: 'Información de Pago',
            type: 'object',
            fields: [
                defineField({
                    name: 'mercadopagoId',
                    title: 'MercadoPago Payment ID',
                    type: 'string',
                    description: 'ID del pago en MercadoPago (si aplica)',
                }),
                defineField({
                    name: 'preferenceId',
                    title: 'MercadoPago Preference ID',
                    type: 'string',
                }),
                defineField({
                    name: 'status',
                    title: 'Estado del Pago',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Pendiente', value: 'pending' },
                            { title: 'Aprobado', value: 'approved' },
                            { title: 'Rechazado', value: 'rejected' },
                            { title: 'Cancelado', value: 'cancelled' },
                            { title: 'Reembolsado', value: 'refunded' },
                            { title: 'En mediación', value: 'in_mediation' },
                        ],
                    },
                    initialValue: 'pending',
                }),
                defineField({
                    name: 'statusDetail',
                    title: 'Detalle del Estado',
                    type: 'string',
                }),
                defineField({
                    name: 'paymentMethod',
                    title: 'Método de Pago',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Tarjeta de crédito', value: 'credit_card' },
                            { title: 'Tarjeta de débito', value: 'debit_card' },
                            { title: 'Efectivo', value: 'cash' },
                            { title: 'Transferencia', value: 'bank_transfer' },
                            { title: 'Otro', value: 'other' },
                        ],
                    },
                }),
                defineField({
                    name: 'paymentType',
                    title: 'Tipo de Pago',
                    type: 'string',
                    description: 'credit_card, debit_card, ticket, bank_transfer, etc.',
                }),
                defineField({
                    name: 'installments',
                    title: 'Cuotas',
                    type: 'number',
                    initialValue: 1,
                }),
                defineField({
                    name: 'transactionAmount',
                    title: 'Monto de Transacción',
                    type: 'number',
                }),
                defineField({
                    name: 'netAmount',
                    title: 'Monto Neto (después de comisiones)',
                    type: 'number',
                }),
            ],
            description: 'Información del pago (opcional para pedidos manuales)',
        }),

        // Shipping Information
        defineField({
            name: 'shipping',
            title: 'Información de Envío',
            type: 'object',
            fields: [
                defineField({
                    name: 'address',
                    title: 'Dirección',
                    type: 'object',
                    fields: [
                        { name: 'street', title: 'Calle', type: 'string' },
                        { name: 'number', title: 'Número', type: 'string' },
                        { name: 'floor', title: 'Piso/Depto', type: 'string' },
                        { name: 'city', title: 'Ciudad', type: 'string' },
                        { name: 'state', title: 'Provincia', type: 'string' },
                        { name: 'zipCode', title: 'Código Postal', type: 'string' },
                        { name: 'country', title: 'País', type: 'string', initialValue: 'Argentina' },
                    ],
                }),
                defineField({
                    name: 'method',
                    title: 'Método de Envío',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Retiro en local', value: 'pickup' },
                            { title: 'Envío a domicilio', value: 'delivery' },
                            { title: 'Correo Argentino', value: 'correo_argentino' },
                            { title: 'Andreani', value: 'andreani' },
                            { title: 'OCA', value: 'oca' },
                        ],
                    },
                }),
                defineField({
                    name: 'cost',
                    title: 'Costo de Envío',
                    type: 'number',
                    initialValue: 0,
                }),
                defineField({
                    name: 'trackingNumber',
                    title: 'Número de Seguimiento',
                    type: 'string',
                    description: 'Agregar cuando el pedido sea enviado',
                }),
                defineField({
                    name: 'carrier',
                    title: 'Transportista',
                    type: 'string',
                    description: 'Empresa de transporte',
                }),
                defineField({
                    name: 'shippedAt',
                    title: 'Fecha de Envío',
                    type: 'datetime',
                    description: 'Cuándo el pedido fue despachado',
                }),
                defineField({
                    name: 'deliveredAt',
                    title: 'Fecha de Entrega',
                    type: 'datetime',
                    description: 'Cuándo el pedido fue entregado',
                }),
            ],
        }),

        // Totals
        defineField({
            name: 'totals',
            title: 'Totales',
            type: 'object',
            fields: [
                defineField({
                    name: 'subtotal',
                    title: 'Subtotal',
                    type: 'number',
                    validation: (Rule) => Rule.required().min(0),
                }),
                defineField({
                    name: 'shipping',
                    title: 'Envío',
                    type: 'number',
                    initialValue: 0,
                }),
                defineField({
                    name: 'discount',
                    title: 'Descuento',
                    type: 'number',
                    initialValue: 0,
                }),
                defineField({
                    name: 'total',
                    title: 'Total',
                    type: 'number',
                    validation: (Rule) => Rule.required().min(0),
                }),
            ],
            validation: (Rule) => Rule.required(),
        }),

        // Internal Notes
        defineField({
            name: 'notes',
            title: 'Notas Internas',
            type: 'text',
            rows: 4,
            description: 'Comentarios internos sobre el pedido',
        }),

        // Timestamps
        defineField({
            name: 'createdAt',
            title: 'Fecha de Creación',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
            description: 'Fecha en que se creó el pedido',
        }),
        defineField({
            name: 'updatedAt',
            title: 'Última Actualización',
            type: 'datetime',
        }),
        defineField({
            name: 'paidAt',
            title: 'Fecha de Pago',
            type: 'datetime',
            description: 'Cuándo se recibió el pago',
        }),
    ],

    preview: {
        select: {
            orderNumber: 'orderNumber',
            customerName: 'customer.name',
            total: 'totals.total',
            status: 'status',
            createdAt: 'createdAt',
        },
        prepare({ orderNumber, customerName, total, status, createdAt }) {
            const statusEmoji: Record<string, string> = {
                pending: '⏳',
                paid: '💳',
                processing: '📦',
                shipped: '🚚',
                completed: '✅',
                cancelled: '❌',
                refunded: '💸',
            }
            const emoji = statusEmoji[status as string] || '📋'

            return {
                title: `${emoji} ${orderNumber}`,
                subtitle: `${customerName} - $${total?.toFixed(2) || '0.00'}`,
                description: createdAt ? new Date(createdAt).toLocaleDateString('es-AR') : '',
            }
        },
    },

    orderings: [
        {
            title: 'Más recientes primero',
            name: 'createdAtDesc',
            by: [{ field: 'createdAt', direction: 'desc' }],
        },
        {
            title: 'Más antiguos primero',
            name: 'createdAtAsc',
            by: [{ field: 'createdAt', direction: 'asc' }],
        },
        {
            title: 'Total (mayor a menor)',
            name: 'totalDesc',
            by: [{ field: 'totals.total', direction: 'desc' }],
        },
    ],
})
