import { getErrorResponse, unWrap } from '../../../utils/fetchUtils'
import { getHeaders } from '../helpers'
import fetch from 'node-fetch'

export default algoliaConfig => {
  const headers = getHeaders(algoliaConfig)
  const baseUrl = `https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes`

  return {
    create: async (identity, payload) => {
      try {
        return unWrap(await fetch(`${baseUrl}/users/${identity.id}`, {
          headers,
          method: 'PUT',
          body: JSON.stringify(payload)
        }))
      } catch (error) {
        return getErrorResponse(error)
      }
    },
    getById: async id => {
      try {
        return unWrap(await fetch(`${baseUrl}/users/${id}`, {
          headers
        }))
      } catch (error) {
        return getErrorResponse(error)
      }
    }
  }

}
