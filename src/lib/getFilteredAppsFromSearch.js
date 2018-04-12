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

  // filter by type
  const typeParam = params.get('type')
  if (typeParam) filteredApps = filteredApps.filter(a => a.type === typeParam)

  // filer by category
  const categoryParam = params.get('category')
  if (categoryParam) filteredApps = filteredApps.filter(a => {
    if (!Array.isArray(a.categories)) return false
    return a.categories.includes(categoryParam)
  })

  // filter by tag
  const tagParam = params.get('tag')
  if (tagParam) filteredApps = filteredApps.filter(a => {
    if (!Array.isArray(a.tags)) return false
    return a.tags.includes(tagParam)
  })

  // filter by doctype
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
