import { combineReducers } from 'redux'

import { appsReducers } from '../ducks/myApps'
import alerterReducer from 'cozy-ui/react/Alerter'

const storeApp = combineReducers({
  apps: appsReducers,
  alerts: alerterReducer
})

export default storeApp
