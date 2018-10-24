const SET_FILTER = 'SET_FILTER'

export const filterReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_FILTER:
      state = action.filter
      return state
    default:
      return state
  }
}

export default filterReducer

export const setFilter = filter => ({
  type: SET_FILTER,
  filter
})

// Filter helpers

// Filter creators to avoid redundance in code
const createAttributeFilter = (attr, value) => app => app[attr] === value
const createArrayAttributeFilter = (attr, value) => app =>
  Array.isArray(app[attr]) && app[attr].includes(value)

// Curryer for filter creators
const curryCreateFilter = (createFilterFn, attr) => value =>
  createFilterFn(attr, value)

// Specific filters
const doctypeFilter = value => app =>
  app.permissions &&
  Object.values(app.permissions).find(permission => permission.type === value)

// Set of filters by attribute, every property is a function which take a value
// as argument and return a filter function to test on apps.
// Add filtering on new attributes here, example to filter on version:
//  version: curryCreateFilter(createAttributeFilter, 'version')
const filters = {
  category: curryCreateFilter(createArrayAttributeFilter, 'categories'),
  doctype: doctypeFilter,
  tag: curryCreateFilter(createArrayAttributeFilter, 'tags'),
  type: curryCreateFilter(createAttributeFilter, 'type')
}

export const filterApps = (criteria, apps) =>
  criteria
    ? Object.keys(filters).reduce(
        (filtered, key) =>
          // Example: filtered.filter(filters['doctype']('io.cozy.files'))
          criteria[key]
            ? filtered.filter(filters[key](criteria[key]))
            : filtered,
        apps
      )
    : apps
