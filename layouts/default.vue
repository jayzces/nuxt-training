<template>
  <div class="app">
    <header class="app-header">
      <nuxt-link to="/" class="app-logo">
        <img src="/images/logo.svg" alt="Site Logo" />
      </nuxt-link>

      <div class="app-search">
        <input type="text"
          ref="citySearch"
          @changed="changed"
          placeholder="Enter your address" />
        <input type="text" class="datepicker" placeholder="Check in" />
        <input type="text" class="datepicker" placeholder="Check out" />
        <button type="button">
          <img src="/images/icons/search.svg" alt="null" />
        </button>
      </div>

      <div class="app-user-menu">
        <template v-if="isLoggedIn">
          <img src="/images/icons/house.svg" alt="null" />
          <div class="name">Host</div>
          <img :src="user.profileUrl" :alt="user.fullName" class="avatar" />
        </template>

        <div v-show="!isLoggedIn" id="googleButton" class="ml-8"></div>
      </div>
    </header>
    <nuxt />
  </div>
</template>

<script>
  export default {
    methods: {
      changed(event) {
        const place = event.detail
        if (!place.geometry) return

        this.$router.push({
          name: 'search',
          query: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            label: this.$refs.citySearch.value
          }
        })
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.state.auth.isLoggedIn
      },
      user() {
        return this.$store.state.auth.user
      }
    },
    mounted() {
      this.$maps.makeAutoComplete(this.$refs.citySearch)
    }
  }
</script>
