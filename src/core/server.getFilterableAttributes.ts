'use server'

import { client } from '@/sanity/lib/client';

export type FilterableFeature = {
    _id: string;
    name: string;
    icon?: string;
    filterInputType: 'checkbox' | 'radio' | 'select';
    filterPriority: number;
    fixedValues: string[];
}

/**
 * Obtiene todas las características filtrables con sus valores predefinidos
 * Solo retorna features marcadas como filtrables
 */
export async function getFilterableAttributes(): Promise<FilterableFeature[]> {
    
    const query = `*[_type == "feature" && filterable == true && hasFixedValues == true] | order(filterPriority asc, name asc) {
        _id,
        name,
        icon,
        filterInputType,
        filterPriority,
        fixedValues
    }`;

    const features = await client.fetch(query);
    return features || [];
}
