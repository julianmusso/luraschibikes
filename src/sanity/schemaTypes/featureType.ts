import { defineField, defineType } from 'sanity'

export const featureType = defineType({
    name: 'feature',
    title: 'Característica',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre de la característica',
            type: 'string',
            description: 'Ej: Peso, Material, Dimensiones',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'icon',
            title: 'Icono',
            type: 'string',
            options: {
                list: [
                    { title: '⚖️ Peso', value: 'FaWeightHanging' },
                    { title: '📏 Dimensiones', value: 'FaRuler' },
                    { title: '🎨 Color', value: 'FaPalette' },
                    { title: '🔧 Material', value: 'FaWrench' },
                    { title: '⚙️ Compatibilidad', value: 'FaCog' },
                    { title: '📦 Tamaño', value: 'FaBoxOpen' },
                    { title: '⚡ Velocidad', value: 'FaBolt' },
                    { title: '🔩 Tornillos', value: 'FaScrewdriver' },
                    { title: '🚴 Bicicleta', value: 'FaBicycle' },
                    { title: '💪 Resistencia', value: 'FaDumbbell' },
                    { title: '🛡️ Garantía', value: 'FaShieldAlt' },
                    { title: '📅 Año', value: 'FaCalendarAlt' },
                    { title: '🏷️ Marca', value: 'FaTag' },
                    { title: '🔄 Rodamiento', value: 'FaSync' },
                    { title: '📐 Ángulo', value: 'FaDraftingCompass' },
                    { title: '🎯 Precisión', value: 'FaCrosshairs' },
                    { title: '🌡️ Temperatura', value: 'FaTemperatureHigh' },
                    { title: '💧 Resistencia agua', value: 'FaTint' },
                    { title: '⭐ Calidad', value: 'FaStar' },
                    { title: '🔒 Seguridad', value: 'FaLock' },
                ],
                layout: 'dropdown',
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción (opcional)',
            type: 'text',
            description: 'Ayuda para el equipo sobre qué representa esta característica',
        }),
        defineField({
            name: 'hasFixedValues',
            title: 'Tiene valores predefinidos',
            type: 'boolean',
            description: 'Si está activado, solo se pueden usar valores de la lista. Si está desactivado, permite valores libres (ej: peso, dimensiones)',
            initialValue: false,
        }),
        defineField({
            name: 'fixedValues',
            title: 'Valores predefinidos',
            type: 'array',
            description: 'Opciones disponibles para esta característica (ej: S, M, L, XL)',
            of: [{ type: 'string' }],
            hidden: ({ document }) => !document?.hasFixedValues,
        }),
        defineField({
            name: 'filterable',
            title: 'Mostrar en filtros de la tienda',
            type: 'boolean',
            description: 'Si está activado, esta característica aparecerá en el panel de filtros',
            initialValue: false,
        }),
        defineField({
            name: 'filterInputType',
            title: 'Tipo de filtro',
            type: 'string',
            options: {
                list: [
                    { title: 'Checkboxes (múltiple selección)', value: 'checkbox' },
                    { title: 'Radio buttons (única selección)', value: 'radio' },
                    { title: 'Dropdown', value: 'select' },
                ],
            },
            initialValue: 'checkbox',
            hidden: ({ document }) => !document?.filterable,
        }),
        defineField({
            name: 'filterPriority',
            title: 'Prioridad en filtros',
            type: 'number',
            description: 'Orden de aparición (menor número = aparece primero)',
            initialValue: 0,
            hidden: ({ document }) => !document?.filterable,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            icon: 'icon',
            hasFixedValues: 'hasFixedValues',
            filterable: 'filterable',
            fixedValuesCount: 'fixedValues',
        },
        prepare({ title, icon, hasFixedValues, filterable, fixedValuesCount }) {
            // Mapeo simple de iconos a emojis para el preview
            const iconEmoji: Record<string, string> = {
                'FaWeightHanging': '⚖️',
                'FaRuler': '📏',
                'FaPalette': '🎨',
                'FaWrench': '🔧',
                'FaCog': '⚙️',
                'FaBoxOpen': '📦',
                'FaBolt': '⚡',
                'FaScrewdriver': '🔩',
                'FaBicycle': '🚴',
                'FaDumbbell': '💪',
                'FaShieldAlt': '🛡️',
                'FaCalendarAlt': '📅',
                'FaTag': '🏷️',
                'FaSync': '🔄',
                'FaDraftingCompass': '📐',
                'FaCrosshairs': '🎯',
                'FaTemperatureHigh': '🌡️',
                'FaTint': '💧',
                'FaStar': '⭐',
                'FaLock': '🔒',
            }
            
            const badges = []
            if (hasFixedValues) badges.push(`${fixedValuesCount?.length || 0} valores`)
            if (filterable) badges.push('✓ Filtrable')
            
            return {
                title: `${iconEmoji[icon] || '📋'} ${title}`,
                subtitle: badges.length > 0 ? badges.join(' • ') : 'Valor libre',
            }
        },
    },
})
