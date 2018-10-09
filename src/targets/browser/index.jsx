/* global cozy */

import 'styles'

import React from 'react'
import { render } from 'react-dom'

import store from 'lib/store'

const renderApp = function(lang) {
  const Root = require('ducks/components/Root').default
  render(
    <Root store={store} lang={lang} />,
    document.querySelector('[role=application]')
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  cozy.client.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })
  cozy.bar.init({
    appEditor: data.cozyAppEditor,
    appName: data.cozyAppName,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
  })

  renderApp(data.cozyLocale)
})
