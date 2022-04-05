import { getErrorResponse, unWrap } from '../../../utils/fetchUtils'
import { getHeaders } from '../helpers'
import fetch from 'node-fetch'

export default algoliaConfig => {
  const headers = getHeaders(algoliaConfig)
  const baseUrl = `https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes`

  return {
    assignHome: async function(identity, homeId) {
      const payload = (await this.getById(identity.id)).json
      payload.homeId.push(homeId)
      this.create(identity, payload)
    },
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
    },
    removeHome: async function(identity, homeId) {
      const payload = (await this.getById(identity.id)).json
      const homes = payload.homeId.filter(id => id !== homeId)
      payload.homeId = homes
      this.create(identity, payload)
    }
  }

}
