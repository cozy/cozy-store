import React from 'react'
import { Provider } from 'react-redux'
import { I18n } from 'cozy-ui/react/I18n'
import { HashRouter } from 'react-router-dom'

import App from './App'

const Root = ({ context, lang, store }) => {
  return <I18n lang={lang} dictRequire={(lang) => require(`../locales/${lang}`)}>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </I18n>
}

export default Root
