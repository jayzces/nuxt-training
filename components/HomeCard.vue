<template>
  <div style="float:left;margin:10px">
      <img :src="home.images[0]" style="width:200px"/><br />
      {{ home.title }}<br />
      {{ home.location.address }}, {{ home.location.city }}, {{ home.location.state }}, {{ home.location.country }}<br />
      {{ home.guests }} guests<br />
      {{ home.pricePerNight }} / night<br />
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
