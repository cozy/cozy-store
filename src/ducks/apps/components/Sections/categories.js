/**
 * Deal with app category options.
 *
 * Category options have the following attributes
 *
 * - value: Slug of the category
 * - label: Translated name of the category
 * - secondary: Whether to be displayed as a smaller category
 *   in the sidebar
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

/**
 * Function to sort category options
 *
 * Alphabetical sort on label except for
 *   - 'all' value always at the beginning
 *   - 'others' value always at the end
 *
 * @param  {CategoryOption} categoryA
 * @param  {CategoryOption} categoryB
 * @return {Number}
 */
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

/**
 * Returns unlabelised/unsorted categories from a list of apps
 * @param  {Array<App>}  apps
 * @param  {Boolean} includeAll - Whether to add an "All" option
 * @return {Array<CategoryOption>}
 */
export const generateOptionsFromApps = (
  apps,
  includeAll = false,
  _addLabel
) => {
  const addLabel = x => (_addLabel ? _addLabel(x) : x)
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
      appsCategories.push(
        addLabel({
          value: 'konnectors',
          secondary: false
        })
      )
    }
    const options = Object.keys(catApps).map(cat => {
      return addLabel({
        value: cat,
        type: type,
        secondary: type === APP_TYPE.KONNECTOR
      })
    })
    if (_addLabel) {
      options.sort(sorter)
    }
    appsCategories = appsCategories.concat(options)
  }

  return appsCategories
}