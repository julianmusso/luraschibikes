import { defineField, defineType } from 'sanity'

export const attributeType = defineType({
    name: 'attribute',
    title: 'Atributo de variación',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre del atributo',
            type: 'string',
            description: 'Ej: Color, Talla, Material',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Tipo de atributo',
            type: 'string',
            options: {
                list: [
                    { title: 'Color', value: 'color' },
                    { title: 'Texto', value: 'text' },
                ],
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'values',
            title: 'Valores disponibles',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'attributeValue',
                    fields: [
                        {
                            name: 'label',
                            title: 'Etiqueta',
                            type: 'string',
                            description: 'Nombre que ve el cliente (ej: "Rojo", "M", "Grande")',
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'value',
                            title: 'Valor',
                            type: 'string',
                            description: 'Valor interno (ej: "red", "m", "lg")',
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'color',
                            title: 'Color',
                            type: 'color',
                            description: 'Solo para atributos de tipo "Color"',
                            hidden: ({ document }) => document?.type !== 'color',
                        },
                    ],
                    preview: {
                        select: {
                            label: 'label',
                            value: 'value',
                            color: 'color.hex',
                        },
                        prepare({ label, value, color }) {
                            return {
                                title: label,
                                subtitle: `${value}${color ? ` - ${color}` : ''}`,
                            }
                        },
                    },
                },
            ],
            validation: (rule) => rule.required().min(1),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            type: 'type',
            valuesCount: 'values',
        },
        prepare({ title, type, valuesCount }) {
            return {
                title,
                subtitle: `${type === 'color' ? '🎨 Color' : '📝 Texto'} - ${valuesCount?.length || 0} valores`,
            }
        },
    },
})
