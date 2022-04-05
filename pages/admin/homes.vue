<template>
  <div>
    <div v-for="h in homesList" :key="h.objectID">{{ h.title }}
      <button class="text-red-800"
        @click="deleteHome(h.objectID)">Delete</button>
    </div>

    <h2 class="text-xl bold">Add a Home</h2>

    <form action="" class="form" @submit.prevent="onSubmit">
      Images: <br />
      <image-uploader @file-uploaded="imageUpdated($event, 0)" />
      <image-uploader @file-uploaded="imageUpdated($event, 1)" />
      <image-uploader @file-uploaded="imageUpdated($event, 2)" />
      <image-uploader @file-uploaded="imageUpdated($event, 3)" />
      <image-uploader @file-uploaded="imageUpdated($event, 4)" />

      Title <br />
      <input type="text" v-model.trim="home.title" class="w-60" /><br />

      Description <br />
      <textarea v-model.trim="home.description" class="w-104"></textarea><br />

      Note <br />
      <textarea v-model.trim="home.note" class="w-104"></textarea><br />

      Features <br />
      <input type="text" v-model.trim="home.features[0]" class="w-26" />
      <input type="text" v-model.trim="home.features[1]" class="w-26" />
      <input type="text" v-model.trim="home.features[2]" class="w-26" />
      <input type="text" v-model.trim="home.features[3]" class="w-26" />
      <input type="text" v-model.trim="home.features[4]" class="w-26" /><br />

      Price Per Night <br />
      <input type="number" v-model="home.pricePerNight" class="w-14" /><br />

      Guests / Rooms / Beds / Baths <br />
      <input type="number" v-model="home.guests" class="w-14" />
      <input type="number" v-model="home.bedrooms" class="w-14" />
      <input type="number" v-model="home.beds" class="w-14" />
      <input type="number" v-model="home.bathrooms" class="w-14" /><br />

      <input type="text"
        ref="locationSelector"
        autocomplete="off"
        placeholder="Select a Location"
        @changed="changed" />
      <br />

      Address:
      <input type="text" v-model.trim="home.location.address" class="w-60" /><br />

      City:
      <input type="text" v-model.trim="home.location.city" class="w-26" /><br />

      State:
      <input type="text" v-model.trim="home.location.state" class="w-26" /><br />

      Postal Code:
      <input type="text" v-model.trim="home.location.postalCode" class="w-26" /><br />

      Country:
      <input type="text" v-model.trim="home.location.country" class="w-26" /><br />

      <button class="border px-4 py-2 border-gray-400">Add</button>
    </form>
  </div>
</template>

<script>
  import { unWrap } from '~/utils/fetchUtils'

  export default {
    data() {
      return {
        homesList: [],
        home: {
          title: '',
          description: '',
          note: '',
          pricePerNight: '',
          guests: '',
          bedrooms: '',
          beds: '',
          bathrooms: '',
          features: ['', '', '', '', ''],
          location: {
            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          _geoloc: {
            lat: '',
            lng: ''
          },
          images: []
        }
      }
    },
    methods: {
      async deleteHome(homeId) {
        console.log({ homeId })

        await fetch(`/api/homes/${homeId}`, {
          method: 'DELETE'
        })

        const index = this.homesList.findIndex(obj => obj.objectID === homeId)
        this.homesList.splice(index, 1)
      },
      async onSubmit() {
        const response = await unWrap(await fetch('/api/homes', {
          method: 'POST',
          body: JSON.stringify(this.home),
          headers: {
            'Content-Type': 'application/json'
          }
        }))

        this.homesList.push({
          title: this.home.title,
          objectId: response.json.homeId
        })
      },
      async setHomesList() {
        this.homesList = (await unWrap(await fetch('/api/homes/user'))).json
      },
      changed(event) {
        const addressParts = event.detail.address_components
        const street = this.getAddressPart(addressParts, 'street_number')
        const route = this.getAddressPart(addressParts, 'route')
        this.home.location.address = `${street} ${route}`
        this.home.location.city = this.getAddressPart(addressParts, 'locality')
        this.home.location.state = this.getAddressPart(addressParts, 'administrative_area_level_1', false)
        this.home.location.country = this.getAddressPart(addressParts, 'country')
        this.home.location.postalCode = this.getAddressPart(addressParts, 'postal_code')

        const geo = event.detail.geometry.location
        this.home._geoloc.lat = geo.lat()
        this.home._geoloc.lng = geo.lng()
      },
      getAddressPart(parts, type, shortName = true) {
        if (shortName)
          return parts.find(part => part.types.includes(type))?.short_name || ''
        return parts.find(part => part.types.includes(type))?.long_name || ''
      },
      imageUpdated(imageUrl, index) {
        this.home.images[index] = imageUrl
      },
    },
    mounted() {
      this.$maps.makeAutoComplete(this.$refs.locationSelector, ['address'])
      this.setHomesList()
    }
  }
</script>

<style scoped>
  .form input,
  .form textarea {
    @apply p-1 m-1 bg-gray-200;
  }
</style>
