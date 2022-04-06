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
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],
  modules: [
    // is sequential

    // server middlewares
    '~/modules/auth',
    '~/modules/algolia',
    '~/modules/cloudinary',
    '@nuxtjs/cloudinary',
    '~/modules/stripe'
  ],
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: '',
    appId: ''
  },
  image: {
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
    }
  },
  plugins: [
    '~/plugins/maps.client',
    '~/plugins/dataApi',
    '~/plugins/auth.client',
    '~/plugins/vCalendar.client',
    '~/plugins/stripe.client'
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
    },
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY,
    },
    stripe: {
      key: process.env.STRIPE_PUBLIC_KEY
    }
  },
  // for server-side rendering
  privateRuntimeConfig: {
    // if referenced in modules for server middleware, include variables that would normally be replaced at build time e.g. algolia.appId
    algolia: {
      appId: process.env.ALGOLIA_ID,
      apiKey: process.env.ALGOLIA_WRITE_API_KEY
    },
    cloudinary: {
      apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY
    }
  },
  router: {
    prefetchLinks: false
  }
}
