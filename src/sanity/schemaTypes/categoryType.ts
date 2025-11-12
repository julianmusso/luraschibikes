import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
    name: 'category',
    title: 'Categoría',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre',
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
            type: 'text',
        }),
        defineField({
            name: 'parent',
            title: 'Categoría padre',
            description: 'Para crear subcategorías',
            type: 'reference',
            to: [{ type: 'category' }],
        }),
        defineField({
            name: 'image',
            title: 'Imagen de la categoría',
            type: 'image',
            options: { hotspot: true },
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            parent: 'parent.name',
        },
        prepare({ title, media, parent }) {
            return {
                title,
                subtitle: parent ? `Subcategoría de ${parent}` : 'Categoría principal',
                media,
            }
        },
    },
})
