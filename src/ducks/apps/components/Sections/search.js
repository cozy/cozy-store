import overEvery from 'lodash/overEvery'
import mapValues from 'lodash/mapValues'
import matches from 'lodash/matches'

import { APP_TYPE } from './constants'

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

/**
 * Returns a predicate function to match an app based on
 * a search specificiation.
 *
 * @param  {Object} search - What to search, ex: { type: 'webapp', category: 'banking'}
 * @return {Function}
 */
export const makeMatcherFromSearch = (search = {}) => {
  // Create all predicates from the search object
  const predicates = Object.values(
    mapValues(search, (value, name) => {
      return searchAttrToMatcher[name](value)
    })
  )
  // Return a function returning true if all predicates pass
  return overEvery(predicates)
}

export const makeOptionMatcherFromSearch = (search = {}) => {
  const typeParam = search.type
  const categoryParam = search.category
  if (typeParam === APP_TYPE.KONNECTOR && !categoryParam) {
    return matches({ value: 'konnectors' })
  } else if (!typeParam && !categoryParam) {
    return matches({ value: 'all' })
  }
  return matches({ value: categoryParam, type: typeParam })
}
export const makeSearchFromOption = option => {
  if (option.value === 'all') {
    return {}
  }
  const search = {}
  if (option.value === 'konnectors') {
    search.type = APP_TYPE.KONNECTOR
  } else {
    search.type = option.type
    search.category = option.value
  }
  return search
}
