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
        // Google Fonts CDN — preview fallback while self-hosted font files are not yet in repo.
        // Replace with self-hosted @font-face (fonts.css) once /public/fonts/ is populated.
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&family=Space+Mono&display=swap',
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

  nitro: {
    prerender: {
      ignore: ['/dev/components'],
    },
  },

  // No @nuxtjs/google-fonts — self-host only (brand requirement)
  modules: [],
})
