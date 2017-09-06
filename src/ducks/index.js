import { combineReducers } from 'redux'

import { myAppsReducers } from '../ducks/myApps'

const storeApp = combineReducers({
  myApps: myAppsReducers
})

export default storeApp
