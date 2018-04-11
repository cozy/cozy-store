/* global cozy */
import 'babel-polyfill'

import 'styles'

import React from 'react'
import { render } from 'react-dom'
import store from 'lib/store'

import I18n from 'cozy-ui/react/I18n'
import IntentHandler from '../../ducks/components/intents/IntentHandler'

// import 'styles/intents.styl'

// const lang = document.documentElement.getAttribute('lang') || 'en'
// const context = window.context || 'cozy'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const appData = root.dataset

  cozy.client.init({
    cozyURL: '//' + appData.cozyDomain,
    token: appData.cozyToken
  })

  render(
    <I18n
      lang={appData.cozyLocale}
      dictRequire={lang => require(`../../locales/${lang}`)}
    >
      <IntentHandler
        intents={cozy.client.intents}
        appData={appData}
        store={store}
      />
    </I18n>,
    document.querySelector('[role=application]')
  )
})
