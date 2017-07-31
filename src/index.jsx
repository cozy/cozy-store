/* global cozy, __DEVELOPMENT__ */

import 'babel-polyfill'

import './styles'

import React from 'react'
import { render } from 'react-dom'

import store from './lib/store'
import Root from './components/Root'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

const renderApp = function (lang) {
  render(<Root
    store={store}
    lang={lang} />, document.querySelector('[role=application]'))
}

if (module.hot) {
  module.hot.accept('./components/Root', () => requestAnimationFrame(renderApp))
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
