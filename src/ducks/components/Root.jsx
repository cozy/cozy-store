import App from 'ducks/components/App'
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import { BarProvider } from 'cozy-bar'
import { CozyProvider } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

const Root = ({ client, lang = 'en', store }) => {
  if (!client) return null
  return (
    <WebviewIntentProvider>
      <CozyTheme variant="normal" className="u-flex-grow-1">
        <I18n lang={lang} dictRequire={lang => require(`locales/${lang}`)}>
          <Provider store={store}>
            <CozyProvider client={client}>
              <BarProvider>
                <HashRouter>
                  <App />
                </HashRouter>
              </BarProvider>
            </CozyProvider>
          </Provider>
        </I18n>
      </CozyTheme>
    </WebviewIntentProvider>
  )
}

export default Root
