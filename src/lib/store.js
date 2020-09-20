import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import appReducers from 'ducks'
import { createLogger } from 'redux-logger'
import flag from 'cozy-flags'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/transpiled/react/helpers/tracker'

const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middlewares = [
  thunkMiddleware,
  flag('store.redux-logger') && process.env.NODE_ENV !== 'browser:production'
    ? loggerMiddleware
    : null
].filter(Boolean)

if (shouldEnableTracking() && getTracker()) {
  middlewares.push(createTrackerMiddleware())
}

export default createStore(
  appReducers,
  composeEnhancers(applyMiddleware.apply(null, middlewares))
)
