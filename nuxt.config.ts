// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Study Timer',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/ico',
          href: '/favicon.ico',
        },
      ],
    },
  },

  css: ['@/assets/css/styles.scss'],
  modules: [
    '@nuxt/ui',
    'nuxt-gtag',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  colorMode: {
    classSuffix: '',
  },
  googleFonts: {
    families: {},
  },
  gtag: {
    id: 'G-QNLZ5NY7HH',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
});
