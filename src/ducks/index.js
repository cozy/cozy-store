import { appsReducers } from 'ducks/apps'
import { combineReducers } from 'redux'

const storeApp = combineReducers({
  apps: appsReducers
})

export default storeApp
