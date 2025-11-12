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
    ],
    preview: {
        select: {
            title: 'name',
            icon: 'icon',
        },
        prepare({ title, icon }) {
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
            
            return {
                title: `${iconEmoji[icon] || '📋'} ${title}`,
                subtitle: icon,
            }
        },
    },
})
