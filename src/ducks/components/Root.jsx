import React from 'react'
import { Provider } from 'react-redux'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import PiwikHashRouter from 'lib/PiwikHashRouter'

import { CozyProvider } from 'cozy-client'

import App from 'ducks/components/App'

const Root = ({ client, lang, store }) => {
  return (
    <CozyTheme variant="normal" className="u-flex-grow-1">
      <I18n lang={lang} dictRequire={lang => require(`locales/${lang}`)}>
        <CozyProvider client={client}>
          <Provider store={store}>
            <PiwikHashRouter>
              <App />
            </PiwikHashRouter>
          </Provider>
        </CozyProvider>
      </I18n>
    </CozyTheme>
  )
}

export default Root
