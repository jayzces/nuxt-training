import { getErrorResponse, unWrap } from '~/utils/fetchUtils'

export default function ({ $config }, inject) {
  const appId = $config.algolia.appId
  const apiKey = $config.algolia.apiKey
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
}
