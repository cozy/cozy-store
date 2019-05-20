import overEvery from 'lodash/overEvery'
import mapValues from 'lodash/mapValues'

const getDoctypesList = permsObj => {
  const doctypes = []
  for (let p in permsObj) {
    if (permsObj[p].type) doctypes.push(permsObj[p].type)
  }
  return doctypes
}

const typeMatcher = type => app => app.type === type
const categoryMatcher = category => app => {
  if (!Array.isArray(app.categories)) return false
  return app.categories.includes(category)
}
const tagMatcher = tag => app => {
  if (!Array.isArray(app.tags)) return false
  return app.tags.includes(tag)
}
const doctypeMatcher = doctype => app => {
  if (!app.permissions) return false
  return getDoctypesList(app.permissions).includes(doctype)
}
const pendingUpdateMatcher = () => app => !!app.availableVersion

const searchAttrToMatcher = {
  type: typeMatcher,
  category: categoryMatcher,
  tag: tagMatcher,
  doctype: doctypeMatcher,
  pendingUpdate: pendingUpdateMatcher
}

/* From a search object, makes a predicate to match an app */
const matcherFromSearch = (search = {}) => {
  // Create all predicates from the search object
  const predicates = Object.values(
    mapValues(search, (value, name) => {
      return searchAttrToMatcher[name](value)
    })
  )
  // Return a function returning true if all predicates pass
  return overEvery(predicates)
}

export default matcherFromSearch
