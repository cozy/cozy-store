import 'url-search-params-polyfill'

const isNavigationEnabled = (search = '') => {
  /* global URLSearchParams */
  const params = new URLSearchParams(search)
  const navOption = params.get('nav')
  return navOption === null || navOption !== 'false'
}

export default isNavigationEnabled
