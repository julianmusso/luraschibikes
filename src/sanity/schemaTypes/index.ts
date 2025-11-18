import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './productType'
import { categoryType } from './categoryType'
import { featureType } from './featureType'
import { attributeType } from './attributeType'
import { orderType } from './orderType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType, categoryType, featureType, attributeType, orderType],
}