<template>
  <div class="app-search-results-page">
    <div class="app-search-results">
      <div class="app-search-results-listing">
        <h2 class="app-title">Stays in {{ label }}</h2>

        <nuxt-link v-for="home in homes"
          :key="home.objectID"
          :to="`/home/${home.objectID}`">
          <home-row :home="home"
            @mouseover.native="highlightMarker(home.objectID, true)"
            @mouseout.native="highlightMarker(home.objectID, false)"
            class="app-house" />
        </nuxt-link>
      </div>
      <div class="app-search-results-map">
        <div class="app-map" ref="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: `Homes around ${this.label}`
      }
    },
    methods: {
      getHomeMarkers() {
        if (this.homes.length === 0) return null
        return this.homes.map(home => ({
          ...home._geoloc,
          pricePerNight: home.pricePerNight,
          id: home.objectID
        }))
      },
      highlightMarker(homeId, isHighlighted) {
        document.querySelector(`.home-${homeId}`)?.classList?.toggle('marker-highlight', isHighlighted)
      },
      updateMap() {
        this.$maps.showMap(this.$refs.map, this.lat, this.lng, this.getHomeMarkers())
      }
    },
    mounted() {
      this.updateMap()
    },
    async beforeRouteUpdate(to, from, next) {
      const data = await this.$dataApi.getHomesByLocation(
        to.query.lat, to.query.lng, to.query.start, to.query.end)
      this.homes = data.json.hits
      this.label = to.query.label
      this.lat = to.query.lat
      this.lng = to.query.lng
      this.updateMap()
      next()
    },
    async asyncData({ query, $dataApi }) {
      const data = await $dataApi
        .getHomesByLocation(query.lat, query.lng, query.start, query.end)
      return {
        homes: data.json.hits,
        // no ...query to control url queryParams and remove any extra input
        label: query.label,
        lat: query.lat,
        lng: query.lng
      }
    }
  }
</script>

<style>
  .marker {
    background-color: white;
    padding: 5px 8px;
    font-weight: bold;
    border: 1px solid lightgray;
    border-radius: 20px;
  }

  .marker-highlight {
    background-color: black;
    color: white !important;
    border-color: black;
  }
</style>
