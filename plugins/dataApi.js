export default function (context, inject) {
  const appId = context.env.NUXT_ENV_ALGOLIA_ID
  const apiKey = context.env.NUXT_ENV_ALGOLIA_API_KEY
  const baseUrl = `https://${appId}-dsn.algolia.net/1/indexes`
  const headers = {
    'X-Algolia-API-Key': apiKey,
    'X-Algolia-Application-Id': appId
  }

  inject('dataApi', {
    getHome,
    getHomeByLocation,
    getReviewsByHomeId,
    getUserByHomeId,
  })

  async function getHome(homeId) {
    try {
      return unWrap(await fetch(`${baseUrl}/homes/${homeId}`, { headers }))
    } catch(error) {
      return getErrorResponse(error)
    }
  }

  async function getHomeByLocation(lat, lng, radiusInMeters = 1500) {
    try {
      return unWrap(await fetch(`${baseUrl}/homes/query`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          aroundLatLng: `${lat}, ${lng}`,
          aroundRadius: radiusInMeters,
          attributesToHighlight: [],
          hitsPerPage: 10
        })
      }))
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getReviewsByHomeId(homeId) {
    try {
      return unWrap(await fetch(`${baseUrl}/reviews/query`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          filters: `homeId:${homeId}`,
          hitsPerPage: 6,
          attributesToHighlight: []
        })
      }))
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getUserByHomeId(homeId) {
    try {
      return unWrap(await fetch(`${baseUrl}/users/query`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          filters: `homeId:${homeId}`,
          attributesToHighlight: []
        })
      }))
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function unWrap(response) {
    const json = await response.json()
    const { ok, status, statusText } = response
    return { json, ok, status, statusText }
  }

  function getErrorResponse(error) {
    return {
      ok: false,
      status: 500,
      statusText: error.message,
      json: {}
    }
  }
}
