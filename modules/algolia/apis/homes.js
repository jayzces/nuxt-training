import { getErrorResponse, unWrap } from '../../../utils/fetchUtils'
import { getHeaders } from '../helpers'
import fetch from 'node-fetch'

export default algoliaConfig => {
  const headers = getHeaders(algoliaConfig)
  const baseUrl = `https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes`

  return {
    create: async (homeId, payload) => {
      try {
        return unWrap(await fetch(`${baseUrl}/homes/${homeId}`, {
          headers,
          method: 'PUT',
          body: JSON.stringify(payload)
        }))
      } catch (error) {
        return getErrorResponse(error)
      }
    },
    delete: async homeId => {
      try {
        return unWrap(await fetch(`${baseUrl}/homes/${homeId}`, {
          headers,
          method: 'DELETE'
        }))
      } catch (error) {
        return getErrorResponse(error)
      }
    },
    getByUserId: async userId => {
      try {
        return unWrap(await fetch(`${baseUrl}/homes/query`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            filters: `userId:${userId}`,
            attributesToRetrieve: [
              'objectID',
              'title'
            ],
            attributesToHighlight: []
          })
        }))
      } catch (error) {
        return getErrorResponse(error)
      }
    }
  }

}
