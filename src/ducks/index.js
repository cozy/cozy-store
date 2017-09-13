import { combineReducers } from 'redux'

import { appsReducers } from './apps'
import { currentAppVersionReducers } from './apps/currentAppVersion'
import alerterReducer from 'cozy-ui/react/Alerter'

const storeApp = combineReducers({
  apps: appsReducers,
  currentAppVersion: currentAppVersionReducers,
  alerts: alerterReducer
})

export default storeApp
