import App from 'ducks/components/App'
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import { BarProvider } from 'cozy-bar'
import { CozyProvider, RealTimeQueries } from 'cozy-client'
import { DataProxyProvider } from 'cozy-dataproxy-lib'
import { WebviewIntentProvider } from 'cozy-intent'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

const Root = ({ client, lang = 'en', store }) => {
  if (!client) return null
  return (
    <WebviewIntentProvider>
      <I18n lang={lang} dictRequire={lang => require(`locales/${lang}`)}>
        <Provider store={store}>
          <CozyProvider client={client}>
            <DataProxyProvider>
              <CozyTheme variant="normal" className="u-flex-grow-1">
                <AlertProvider>
                  <RealTimeQueries doctype="io.cozy.settings" />
                  <RealTimeQueries doctype="io.cozy.files" />
                  <BarProvider>
                    <HashRouter>
                      <App />
                    </HashRouter>
                  </BarProvider>
                </AlertProvider>
              </CozyTheme>
            </DataProxyProvider>
          </CozyProvider>
        </Provider>
      </I18n>
    </WebviewIntentProvider>
  )
}

export default Root
