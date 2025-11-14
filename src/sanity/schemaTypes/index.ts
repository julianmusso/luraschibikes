import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './productType'
import { categoryType } from './categoryType'
import { featureType } from './featureType'
import { attributeType } from './attributeType'
import { filterAttributeType } from './filterAttributeType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType, categoryType, featureType, attributeType, filterAttributeType],
}