import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import appReducers from '../ducks'
import { createLogger } from 'redux-logger'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/transpiled/react/helpers/tracker'

const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middlewares = [thunkMiddleware, loggerMiddleware]

if (shouldEnableTracking() && getTracker()) {
  middlewares.push(createTrackerMiddleware())
}

export default createStore(
  appReducers,
  composeEnhancers(applyMiddleware.apply(null, middlewares))
)
