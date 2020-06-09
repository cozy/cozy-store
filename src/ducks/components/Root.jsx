import React from 'react'
import { Provider } from 'react-redux'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import PiwikHashRouter from 'lib/PiwikHashRouter'

import { CozyProvider } from 'cozy-client'

import App from 'ducks/components/App'

const Root = ({ client, lang, store }) => {
  return (
    <I18n lang={lang} dictRequire={lang => require(`locales/${lang}`)}>
      <CozyProvider client={client}>
        <Provider store={store}>
          <PiwikHashRouter>
            <App />
          </PiwikHashRouter>
        </Provider>
      </CozyProvider>
    </I18n>
  )
}

export default Root
