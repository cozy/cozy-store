import { combineReducers } from 'redux'

import { appsReducers } from './apps'
import filterReducer from './filter'

const storeApp = combineReducers({
  apps: appsReducers,
  filter: filterReducer
})

export default storeApp
