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
    getHomes,
    getHomesByLocation,
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

  async function getHomes() {
    try {
      return unWrap(await fetch(`${baseUrl}/homes/query`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          attributesToHighlight: [],
          hitsPerPage: 3
        })
      }))
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getHomesByLocation(
    lat,
    lng,
    start,
    end,
    radiusInMeters = 1500 * 15
  ) {
    const days = []
    for (let day = start; day <= end; day += 86400) {
      days.push(`availability:${day}`)
    }

    try {
      return unWrap(await fetch(`${baseUrl}/homes/query`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          aroundLatLng: `${lat}, ${lng}`,
          aroundRadius: radiusInMeters,
          attributesToHighlight: [],
          hitsPerPage: 10,
          filters: days.join(' AND ')
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
