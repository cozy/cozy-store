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
