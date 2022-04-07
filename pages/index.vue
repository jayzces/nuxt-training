<template>
  <div class="app">
    <div class="app-container">
      <div class="app-hero">
        <h2>- Settle in somewhere new. Discover stays to live, work, or just relax.</h2>
      </div>
    </div>

    <section-premium-listings />
    <section-recently-added class="app-background-grey" :homes="homes" />
    <section-more />
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: 'Homepage',
        meta: [
          {
            name: 'description',
            content: 'NuxtBNB is an AirBNB app that uses Nuxt, Cloudinary, Stripe, Google Maps and Algolia. Learn more at MasteringNuxt.com',
            hid: 'description'
          }
        ]
      }
    },
    async asyncData({ $dataApi }) {
      const homes = await $dataApi.getHomes()

      return {
        homes: homes.json.hits
      }
    }
  }
</script>
