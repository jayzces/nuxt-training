import { unWrap } from '~/utils/fetchUtils'
import Cookie from 'js-cookie'

export default ({ $config, store }, inject) => {
  window.initAuth = init

  addScript()
  inject('auth', {
    signOut
  })

  function addScript() {
    const script = document.createElement('script')
    script.src = `https://apis.google.com/js/platform.js?onload=initAuth`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }

  function init() {
    window.gapi.load('auth2', async function () {
      /* Ready. Make a call to gapi.auth2.init or some other API */
      const auth2 = await window.gapi.auth2.init({
        client_id: $config.auth.clientId
      })

      auth2.currentUser.listen(parseUser)
    })

    window.gapi.signin2.render('googleButton', {
      onsuccess: parseUser,
    })
  }

  async function parseUser(user) {
    // const profile = user.getBasicProfile()
    if (!user.isSignedIn()) {
      Cookie.remove($config.auth.cookieName)
      store.commit('auth/user', null)
      return
    }

    const idToken = user.getAuthResponse().id_token
    Cookie.set($config.auth.cookieName, idToken, {
      expires: 1/24,
      sameSite: 'lax'
    })

    try {
      const response = await unWrap(await fetch('/api/user'))
      const userResponse = response.json

      store.commit('auth/user', {
        fullName: userResponse.name,
        profileUrl: userResponse.image
      })
    } catch (error) {
      console.error(error)
    }

  }

  function signOut() {
    const auth2 = window.gapi.auth2.getAuthInstance()
    auth2.signOut()
  }
}
