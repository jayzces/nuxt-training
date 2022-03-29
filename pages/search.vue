<template>
  <div>Results for {{ label }} <br />
    <div style="width:800px;height:800px;float:right" ref="map"></div>

    <div v-if="homes.length > 0">
      <nuxt-link v-for="home in homes"
        :key="home.objectID"
        :to="`/home/${home.objectID}`">
        <home-row :home="home"
          @mouseover.native="highlightMarker(home.objectID, true)"
          @mouseout.native="highlightMarker(home.objectID, false)" />
      </nuxt-link>
    </div>
    <div v-else>No results found</div>
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
      const data = await this.$dataApi
        .getHomeByLocation(to.query.lat, to.query.lng)
      this.homes = data.json.hits
      this.label = to.query.label
      this.lat = to.query.lat
      this.lng = to.query.lng
      this.updateMap()
      next()
    },
    async asyncData({ query, $dataApi }) {
      const data = await $dataApi.getHomeByLocation(query.lat, query.lng)
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
