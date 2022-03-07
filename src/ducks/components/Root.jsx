import React from 'react'
import { Provider } from 'react-redux'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import PiwikHashRouter from 'lib/PiwikHashRouter'
import { PersistGate } from 'redux-persist/integration/react'

import { CozyProvider } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'

import App from 'ducks/components/App'

const Root = ({ client, lang, store, persistor }) => {
  return (
    <WebviewIntentProvider>
      <CozyTheme variant="normal" className="u-flex-grow-1">
        <I18n lang={lang} dictRequire={lang => require(`locales/${lang}`)}>
          <CozyProvider client={client}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <PiwikHashRouter>
                  <App />
                </PiwikHashRouter>
              </PersistGate>
            </Provider>
          </CozyProvider>
        </I18n>
      </CozyTheme>
    </WebviewIntentProvider>
  )
}

export default Root
