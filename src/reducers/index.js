import { combineReducers } from 'redux'

import { myAppsReducers } from '../ducks/apps'

const storeApp = combineReducers({
  myApps: myAppsReducers
})

export default storeApp
