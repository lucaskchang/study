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
    '@vueuse/nuxt',
  ],

  colorMode: {
    classSuffix: '',
  },

  gtag: {
    id: 'G-QNLZ5NY7HH',
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  compatibilityDate: '2024-08-21',
});
