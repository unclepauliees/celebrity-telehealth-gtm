import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  typescript: {
    strict: true,
    shim: false,
  },

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/fonts.css',
    '~/assets/css/global.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Obsidian Capital Partners — We Build. We Don\'t Broker.' },
      ],
      link: [
        // Preload Cormorant Garamond 300 (display serif — hero, h1, h2)
        {
          rel: 'preload',
          href: '/fonts/cormorant-garamond-v22-latin-300.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        // Preload Montserrat 300 (light nav, captions)
        {
          rel: 'preload',
          href: '/fonts/montserrat-v26-latin-300.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        // Preload Montserrat 600 (semibold labels, eyebrows, buttons)
        {
          rel: 'preload',
          href: '/fonts/montserrat-v26-latin-600.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // Three.js into its own lazy chunk — loaded only when WebGLCanvas mounts
            if (id.includes('node_modules/three')) {
              return 'three'
            }
            // GSAP into its own lazy chunk
            if (id.includes('node_modules/gsap')) {
              return 'gsap'
            }
            // Named scene chunks for the webgl-scene-engineer to target
            if (id.includes('scene-obsidian') || id.includes('scene1')) {
              return 'scene-obsidian'
            }
            if (id.includes('scene-capital-chain') || id.includes('scene2')) {
              return 'scene-capital-chain'
            }
            if (id.includes('scene-platforms') || id.includes('scene3')) {
              return 'scene-platforms'
            }
            // WebGLCanvas component and its Three.js deps go lazy
            if (id.includes('components/WebGLCanvas')) {
              return 'webgl-canvas'
            }
          },
        },
      },
    },
  },

  // No @nuxtjs/google-fonts — self-host only (brand requirement)
  modules: [],
})
