export default {
  components: true,
  head: {
    titleTemplate: 'Mastering Nuxt: %s',
    htmlAttrs: {
      lang: 'en'
    },
    bodyAttrs: {
      class: ['my-style']
    },
    meta: [
      {
        charset: 'utf-8'
      }
    ]
  },
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],
  modules: [
    // sequential
  ],
  plugins: [
    '~/plugins/maps.client',
    '~/plugins/dataApi'
  ],
  router: {
    prefetchLinks: false
  }
}
