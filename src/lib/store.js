import { createRootReducer } from 'ducks/index'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import flag from 'cozy-flags'

const configureStore = ({ client, setStoreToClient = true }) => {
  const loggerMiddleware = createLogger()

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const middlewares = [
    thunkMiddleware,
    flag('store.redux-logger') && process.env.NODE_ENV !== 'browser:production'
      ? loggerMiddleware
      : null
  ].filter(Boolean)

  const rootReducer = createRootReducer(client)

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware.apply(null, middlewares))
  )

  if (setStoreToClient) {
    client.setStore(store)
  }

  return store
}

export { configureStore }
