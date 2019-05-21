/**
 * Deal with app categories.
 *
 * Category objects have the following attributes
 *
 * - value: Slug of the category
 * - label: Translated name of the category
 * - secondary: Whether to be displayed in the select
 */

import { APP_TYPE } from './constants'

/**
 * Like groupBy except that grouper must return an array values.
 * Thus, an object can be in several groups.
 * If the grouper returns a falsy value, an empty list is assumed.
 */
const multiGroupBy = (iter, grouper) => {
  const groups = {}
  for (const obj of iter) {
    const values = grouper(obj) || []
    values.forEach(v => {
      if (!groups.hasOwnProperty(v)) groups[v] = []
      groups[v].push(obj)
    })
  }
  return groups
}

const getAppCategory = app => app.categories
export const groupApps = apps => multiGroupBy(apps, getAppCategory)

// Function to sort categories objects
//
// Alphabetical sort on label except for
//   - 'all' value always at the beginning
//   - 'others' value always at the end
export const sorter = (categoryA, categoryB) => {
  return (
    (categoryA.value === 'all' && -1) ||
    (categoryB.value === 'all' && 1) ||
    (categoryA.value === 'others' && 1) ||
    (categoryB.value === 'others' && -1) ||
    categoryA.label > categoryB.label
  )
}

export const addLabel = (cat, t) => ({
  ...cat,
  label: t(`app_categories.${cat.value}`)
})

// Returns unlabelised/unsorted categories from a list of apps
export const generateOptionsFromApps = (apps, includeAll = false) => {
  if (!apps || !apps.length) return []
  let appsCategories = includeAll
    ? [
        {
          value: 'all',
          secondary: false
        }
      ]
    : []

  for (const type of [APP_TYPE.WEBAPP, APP_TYPE.KONNECTOR]) {
    const catApps = groupApps(apps.filter(a => a.type === type))
    if (type === APP_TYPE.KONNECTOR) {
      // add konnectors at the end
      appsCategories.push({
        value: 'konnectors',
        secondary: false
      })
    }
    const categories = Object.keys(catApps).map(cat => ({
      value: cat,
      type: type,
      secondary: type === APP_TYPE.KONNECTOR
    }))
    appsCategories = appsCategories.concat(categories)
  }

  return appsCategories
}
