import 'url-search-params-polyfill'

const getDoctypesList = (permsObj = {}) => {
  const doctypes = []
  for (let p in permsObj) {
    if (permsObj[p].type) doctypes.push(permsObj[p].type)
  }
  return doctypes
}

const getFilteredAppsFromSearch = (apps = [], search = '') => {
  let filteredApps = apps
  /* global URLSearchParams */
  const params = new URLSearchParams(search)

  const typeParam = params.get('type')
  if (typeParam) filteredApps = filteredApps.filter(a => a.type === typeParam)

  const doctypeParam = params.get('doctype')
  if (doctypeParam) {
    filteredApps = filteredApps.filter(a => {
      if (!a.permissions) return false
      return getDoctypesList(a.permissions).includes(doctypeParam)
    })
  }

  return filteredApps
}

export default getFilteredAppsFromSearch
