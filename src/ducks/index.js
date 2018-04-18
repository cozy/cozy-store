import { combineReducers } from 'redux'

import { appsReducers } from './apps'

const storeApp = combineReducers({
  apps: appsReducers
})

export default storeApp
