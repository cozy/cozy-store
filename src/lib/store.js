import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import appReducers from 'ducks'
import { createLogger } from 'redux-logger'
import flag from 'cozy-flags'
import { isFlagshipApp } from 'cozy-device-helper'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/transpiled/react/helpers/tracker'

const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const persistConfig = {
  key: 'root',
  storage
}
let reducers = ''
if (isFlagshipApp() || flag('store.redux-persist')) {
  reducers = persistReducer(persistConfig, appReducers)
} else {
  reducers = appReducers
}

const middlewares = [
  thunkMiddleware,
  flag('store.redux-logger') && process.env.NODE_ENV !== 'browser:production'
    ? loggerMiddleware
    : null
].filter(Boolean)

if (shouldEnableTracking() && getTracker()) {
  middlewares.push(createTrackerMiddleware())
}

export default () => {
  let store = createStore(
    reducers,
    composeEnhancers(applyMiddleware.apply(null, middlewares))
  )
  let persistor = persistStore(store)
  return { store, persistor }
}
