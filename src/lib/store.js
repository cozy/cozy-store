import appReducers from 'ducks'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import flag from 'cozy-flags'

const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middlewares = [
  thunkMiddleware,
  flag('store.redux-logger') && process.env.NODE_ENV !== 'browser:production'
    ? loggerMiddleware
    : null
].filter(Boolean)

export default createStore(
  appReducers,
  composeEnhancers(applyMiddleware.apply(null, middlewares))
)
