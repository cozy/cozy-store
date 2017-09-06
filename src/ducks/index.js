import { combineReducers } from 'redux'

import { myAppsReducers } from '../ducks/myApps'
import alerterReducer from 'cozy-ui/react/Alerter'

const storeApp = combineReducers({
  myApps: myAppsReducers,
  alerts: alerterReducer
})

export default storeApp
