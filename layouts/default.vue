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
        <img src="/images/icons/house.svg" alt="null" />
        <div class="name">Host</div>
        <img src="/images/user.jpg" class="avatar" alt="User's Image" />
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
    mounted() {
      this.$maps.makeAutoComplete(this.$refs.citySearch)
    }
  }
</script>
