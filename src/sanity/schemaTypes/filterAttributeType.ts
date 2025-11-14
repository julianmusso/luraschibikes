import { defineField, defineType } from 'sanity'
import { FaFilter } from 'react-icons/fa'

export const filterAttributeType = defineType({
    name: 'filterAttribute',
    title: 'Atributo Filtrable',
    type: 'document',
    icon: FaFilter,
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre del atributo',
            type: 'string',
            description: 'Ej: Tipo de freno, Material del cuadro, Talla',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'icon',
            title: 'Ícono',
            type: 'string',
            description: 'Nombre del ícono de react-icons (ej: FaBicycle, FaWrench)',
        }),
        defineField({
            name: 'filterable',
            title: 'Mostrar en filtros',
            type: 'boolean',
            description: 'Si está activado, este atributo aparecerá en el panel de filtros de la tienda',
            initialValue: true,
        }),
        defineField({
            name: 'priority',
            title: 'Prioridad',
            type: 'number',
            description: 'Orden de aparición en filtros (menor número = mayor prioridad)',
            initialValue: 0,
        }),
        defineField({
            name: 'inputType',
            title: 'Tipo de input',
            type: 'string',
            options: {
                list: [
                    { title: 'Checkboxes (múltiple selección)', value: 'checkbox' },
                    { title: 'Radio buttons (única selección)', value: 'radio' },
                    { title: 'Dropdown', value: 'select' },
                ],
            },
            initialValue: 'checkbox',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'values',
            title: 'Valores disponibles',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'filterAttributeValue',
                    fields: [
                        {
                            name: 'label',
                            title: 'Etiqueta',
                            type: 'string',
                            description: 'Nombre visible (ej: "Freno hidráulico", "Aluminio")',
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'slug',
                            title: 'Slug',
                            type: 'slug',
                            options: {
                                source: 'label',
                                maxLength: 96,
                            },
                            validation: (rule) => rule.required(),
                        },
                    ],
                    preview: {
                        select: {
                            label: 'label',
                            slug: 'slug.current',
                        },
                        prepare({ label, slug }) {
                            return {
                                title: label,
                                subtitle: slug,
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
            icon: 'icon',
            filterable: 'filterable',
            valuesCount: 'values',
        },
        prepare({ title, icon, filterable, valuesCount }) {
            return {
                title,
                subtitle: `${filterable ? '✓' : '✗'} Filtrable - ${valuesCount?.length || 0} valores - ${icon || 'Sin ícono'}`,
            }
        },
    },
})
