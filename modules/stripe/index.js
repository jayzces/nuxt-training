import getApis from '../algolia/apis'
import { rejectHitBadRequest, sendJSON } from '../helpers'
import stripeLib from 'stripe'

export default function () {
  const apis = getApis(this.options.privateRuntimeConfig.algolia)
  const stripe = stripeLib(this.options.privateRuntimeConfig.stripe.secretKey)
  const baseImageUrl = this.options.image.cloudinary.baseURL
  const rootUrl = this.options.rootUrl

  this.nuxt.hook('render:setupMiddleware', app => {
    app.use('/api/stripe/create-session', createSession)
  })

  this.nuxt.hook('render:setupMiddleware', app => {
    app.use('/hooks/stripe', async (req, res, next) => {
      const meta = req.body.data.object.metadata
      await apis.user
        .bookHome(meta.identityId, meta.homeId, meta.start, meta.end)
      res.end(`${meta.identityId} booked ${meta.homeId}`)
    })
  })

  async function createSession(req, res) {
    const body = req.body
    if (!body || !body.homeId || !body.start || !body.end
      || body.start > body.end
    ) {
      return rejectHitBadRequest(res)
    }

    const home = (await apis.homes.get(body.homeId)).json
    const nights = (body.end - body.start) / 86400 + 1
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${rootUrl}/home/${body.homeId}?result=success`,
      cancel_url: `${rootUrl}/home/${body.homeId}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'AUD',
            unit_amount: home.pricePerNight * nights * 100,
            product_data: {
              name: `Reservation for ${home.title}`,
              images: [`${baseImageUrl}${home.images[0]}`]
            }
          },
        }
      ],
      metadata: {
        identityId: req.identity.id,
        homeId: body.homeId,
        start: body.start,
        end: body.end
      }
    })

    sendJSON({ id: session.id }, res)
  }
}
