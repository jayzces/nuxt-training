export default {
  build: {
    extractCSS: true,
    loaders: {
      limit: 0,
    }
  },
  components: true,
  css: [
    '~/assets/sass/app.scss'
  ],
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
    '~/modules/auth',
    '~/modules/algolia'
  ],
  plugins: [
    '~/plugins/maps.client',
    '~/plugins/dataApi',
    '~/plugins/auth.client'
  ],
  publicRuntimeConfig: {
    algolia: {
      appId: process.env.ALGOLIA_ID,
      apiKey: process.env.ALGOLIA_API_KEY
    },
    auth: {
      cookieName: 'idToken',
      clientId: process.env.GOOGLE_CLIENT_ID
    },
    maps: {
      apiKey: process.env.GOOGLE_API_KEY
    }
  },
  // for server-side rendering
  privateRuntimeConfig: {
    // if referenced in modules for server middleware, include variables that would normally be replaced at build time e.g. algolia.appId
    algolia: {
      appId: process.env.ALGOLIA_ID,
      apiKey: process.env.ALGOLIA_WRITE_API_KEY
    },
  },
  router: {
    prefetchLinks: false
  }
}
