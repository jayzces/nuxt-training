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
        <client-only>
          <template #placeholder>
            <input class="datepicker" />
            <span class="-ml-6 mr-2">to</span>
            <input class="datepicker" /><br />
          </template>

          <date-picker v-model="range"
            is-range
            timezone="UTC"
            :modelConfig="{ timeAdjust: '00:00:00' }">
            <template v-slot="{ inputValue, inputEvents }">
              <input :value="inputValue.start"
                v-on="inputEvents.start"
                class="datepicker" />
              <span class="-ml-6 mr-2">to</span>
              <input :value="inputValue.end"
                v-on="inputEvents.end"
                class="datepicker" /><br />
            </template>
          </date-picker>
        </client-only>

        <button type="button" @click="search">
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
    data() {
      return {
        location: {
          lat: 0,
          lng: 0,
          label: ''
        },
        range: {
          start: new Date(),
          end: new Date()
        }
      }
    },
    methods: {
      changed(event) {
        const place = event.detail
        if (!place.geometry) return

        this.location.lat = place.geometry.location.lat()
        this.location.lng = place.geometry.location.lng()
        this.location.label = this.$refs.citySearch.value
      },
      search() {
        if (!this.location.label) return

        this.$router.push({
          name: 'search',
          query: {
            ...this.location,
            start: this.range.start.getTime() / 1000,
            end: this.range.end.getTime() / 1000
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
      this.$maps.makeAutoComplete(this.$refs.citySearch, ['(cities)'])
    }
  }
</script>
