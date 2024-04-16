import { appsReducers } from 'ducks/apps'
import { combineReducers } from 'redux'

const createRootReducer = client => {
  const reducers = {
    apps: appsReducers,
    cozy: client.reducer()
  }

  const appReducer = combineReducers(reducers)

  const rootReducer = (state, action) => {
    return appReducer(state, action)
  }

  return rootReducer
}

export { createRootReducer }
