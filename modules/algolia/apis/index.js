import homesApi from './homes'
import userApi from './user'

export default algoliaConfig => {
  return {
    user: userApi(algoliaConfig),
    homes: homesApi(algoliaConfig)
  }
}
