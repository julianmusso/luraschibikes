'use server'

import { client } from '@/sanity/lib/client';

export async function getCartProducts(productIds: string[]) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
        return [];
    }

    const query = `*[_type == "product" && _id in $ids]{
        "id": _id,
        "name": name,
        "price": price,
        "stock": stock,
        "image": images[0].asset->url
    }`;

    const products = await client.fetch(query, { ids: productIds });
    return products;
}