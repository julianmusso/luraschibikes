import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: process.env.SANITY_API_TOKEN, // Token con permisos de escritura
  perspective: 'published', // o 'previewDrafts' si querés ver borradores
  ignoreBrowserTokenWarning: true // Evita warning en cliente (solo server actions lo usan)
})
