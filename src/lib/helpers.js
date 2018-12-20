import { APP_TYPE } from 'ducks/apps'
import _get from 'lodash.get'

// take a list of apps as parameters and returned them sorted
// by categories in a dictionnary with the category slug as property
export const getAppsSortedByCategories = appsList => {
  return appsList.reduce((sortedAppsObject, app) => {
    app.categories.map(c => {
      if (!sortedAppsObject.hasOwnProperty(c)) sortedAppsObject[c] = []
      sortedAppsObject[c].push(app)
    })
    return sortedAppsObject
  }, {})
}

// alphabetically except for 'others' always at the end and
// 'all' always at the beginning
export const sortCategoriesAlphabetically = (list, t) => {
  return list.sort((a, b) => {
    return (
      (a === 'all' && -1) ||
      (b === 'all' && 1) ||
      (a === 'others' && 1) ||
      (b === 'others' && -1) ||
      t(`app_categories.${a}`) > t(`app_categories.${b}`)
    )
  })
}

// get apps list as parameter and return all categories selection with the value and the label

export const getCategoriesSelections = (apps, t, includeAll = false) => {
  if (!apps || !apps.length) return []
  let appsCategories = includeAll
    ? [
        {
          value: 'all',
          label: t(`app_categories.all`),
          secondary: false
        }
      ]
    : []

  const konnectorsList = getAppsSortedByCategories(
    apps.filter(a => a.type === APP_TYPE.KONNECTOR)
  )
  const webAppsList = getAppsSortedByCategories(
    apps.filter(a => a.type === APP_TYPE.WEBAPP)
  )

  const webAppsCategories = sortCategoriesAlphabetically(
    Object.keys(webAppsList),
    t
  ).map(cat => ({
    value: cat,
    label: t(`app_categories.${cat}`),
    type: APP_TYPE.WEBAPP,
    secondary: false
  }))

  appsCategories = appsCategories.concat(webAppsCategories)

  // add konnectors at the end
  appsCategories.push({
    value: 'konnectors',
    label: t(`app_categories.konnectors`),
    secondary: false
  })

  const konnectorsCategories = sortCategoriesAlphabetically(
    Object.keys(konnectorsList),
    t
  ).map(cat => ({
    value: cat,
    label: t(`app_categories.${cat}`),
    type: APP_TYPE.KONNECTOR,
    secondary: true
  }))

  return appsCategories.concat(konnectorsCategories)
}

export const getTranslatedManifestProperty = (app, path, t) => {
  if (!t || !app || !path) return _get(app, path, '')
  return t(`apps.${app.slug}.${path}`, {
    _: _get(app, path, '')
  })
}

export default {
  getTranslatedManifestProperty,
  getAppsSortedByCategories,
  sortCategoriesAlphabetically,
  getCategoriesSelections
}
