<template>
  <div class="app-background-gray">
    <div class="app-wrapper">
      <div class="app-double-column">
        <div class="app-padded-verticle">
          <h2 class="app-subtitle">Description</h2>
          <div class="app-description">{{ home.description }}</div>
        </div>

        <div class="app-padded-verticle">
          <div v-for="(feature, index) in home.features"
            :key="index"
            class="app-tag">{{ feature }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      home: {
        type: Object,
        required: true
      }
    }
  }
</script>
