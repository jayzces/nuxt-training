export default function ({ $config }, inject) {
  const apiKey = $config.maps.apiKey

  let isLoaded = false
  let waiting = []

  window.initGoogleMaps = init

  addScript()
  inject('maps', { showMap, makeAutoComplete })

  function addScript() {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    document.head.appendChild(script)
  }

  function init() {
    isLoaded = true
    waiting.forEach(item => {
      if (typeof item.fn === 'function') item.fn(...item.arguments)
    })
    waiting = []
  }

  function makeAutoComplete(input) {
    if (!isLoaded) {
      waiting.push({ fn: makeAutoComplete, arguments })
      return
    }

    const autoComplete = new window.google.maps.places.Autocomplete(input, {
      types: ['(cities)']
    });
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      input.dispatchEvent(new CustomEvent('changed', { detail: place }))
    })
  }

  function showMap(canvas, lat, lng, markers) {
    if (!isLoaded) {
      waiting.push({ fn: showMap, arguments })
      return
    }

    const position = new window.google.maps.LatLng(lat, lng)
    const map = new window.google.maps.Map(canvas, {
      zoom: 18,
      center: position,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels.icon',
          styles: [{ visibility: 'off' }]
        }
      ]
    })

    if (!markers) {
      const marker = new window.google.maps.Marker({
        position,
        clickable: false
      })
      marker.setMap(map)
      return
    }

    const bounds = new window.google.maps.LatLngBounds()
    markers.forEach(home => {
      const homePos = new window.google.maps.LatLng(home.lat, home.lng)
      const marker = new window.google.maps.Marker({
        position: homePos,
        label: {
          text: `$${home.pricePerNight}`,
          className: `marker home-${home.id}`
        },
        icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
        clickable: false
      })
      marker.setMap(map)
      bounds.extend(homePos)
    })

    map.fitBounds(bounds)
  }
}
