import { combineReducers } from 'redux'

import { appsReducers } from 'ducks/apps'

const storeApp = combineReducers({
  apps: appsReducers
})

export default storeApp
