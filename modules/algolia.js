import { getErrorResponse, unWrap } from '../utils/fetchUtils'
import fetch from 'node-fetch'

export default function () {
  const algoliaConfig = this.options.privateRuntimeConfig.algolia
  const appId = algoliaConfig.appId
  const apiKey = algoliaConfig.apiKey
  const baseUrl = `https://${appId}-dsn.algolia.net/1/indexes`
  const headers = {
    'X-Algolia-API-Key': apiKey,
    'X-Algolia-Application-Id': appId
  }

  this.nuxt.hook('render:setupMiddleware', app => {
    app.use('/api/user', getUserRoute)
  })

  async function createUser(identity) {
    try {
      return unWrap(await fetch(`${baseUrl}/users/${identity.id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(makeUserPayload(identity))
      }))
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getUserById(id) {
    try {
      return unWrap(await fetch(`${baseUrl}/users/${id}`, {
        headers
      }))
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getUserRoute(req, res, next) {
    const identity = req.identity
    const userData = await getUserById(identity.id)

    if (userData.status === 200) {
      sendJSON(userData.json, res)
      return
    }

    createUser(req.identity)
    sendJSON(makeUserPayload(identity), res)
  }

  function makeUserPayload(identity) {
    return {
      name: identity.name,
      email: identity.email,
      image: identity.image,
      homeId: [],
      reviewCount: 0,
      description: '',
      joined: new Date().toISOString()
    }
  }

  function sendJSON(data, res) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }
}
