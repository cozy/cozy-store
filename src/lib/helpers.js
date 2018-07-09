const SPECIAL_SELECT_OPTIONS = ['all', 'konnectors']

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
      (a === 'webapps' && -1) ||
      (b === 'webapps' && 1) ||
      (a === 'konnectors' && -1) ||
      (b === 'konnectors' && 1) ||
      (a === 'others' && 1) ||
      (b === 'others' && -1) ||
      t(`app_categories.${a}`) > t(`app_categories.${b}`)
    )
  })
}

// get apps list as parameter and return all categories selection with the value and the label

export const getCategoriesSelections = (
  apps,
  t,
  extraOptions = SPECIAL_SELECT_OPTIONS
) => {
  if (!apps.length) return []
  const allCategories = sortCategoriesAlphabetically(
    Object.keys(getAppsSortedByCategories(apps)),
    t
  )
  return sortCategoriesAlphabetically(
    [
      // merge and remove duplicates
      ...new Set([...extraOptions, ...allCategories])
    ],
    t
  ).map(cat => ({
    value: cat,
    label: t(`app_categories.${cat}`)
  }))
}

export default {
  getAppsSortedByCategories,
  sortCategoriesAlphabetically,
  getCategoriesSelections
}
