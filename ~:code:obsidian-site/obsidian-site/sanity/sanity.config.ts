import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemas } from './schemas'

export default defineConfig({
  name: 'ocp-studio',
  title: 'Obsidian Capital Partners',
  projectId: process.env.SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.SANITY_DATASET ?? 'production',
  plugins: [structureTool()],
  schema: { types: schemas },
})
