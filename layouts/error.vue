<template>
  <div style="text-align: center">
    <h1>Error {{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>

    <div style="margin-top: 20px">
      For assistance, please email us at <a href="mailto:help@email.com">help@email.com</a> or call us at <a href="">(012) 345-6789</a>
    </div>
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: `Error ${ this.error.statusCode }`
      }
    },
    props: {
      error: {
        type: Object,
        required: true
      }
    }
  }
</script>
