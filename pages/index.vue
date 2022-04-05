<template>
  <div>
    <div v-for="home in homes" :key="home.objectID">
      <nuxt-link :to="`/home/${home.objectID}`" prefetch>
        <home-card :home="home" />
      </nuxt-link>
    </div>
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
            content: 'This is a homepage!',
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
