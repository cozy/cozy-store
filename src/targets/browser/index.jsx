/* global cozy */

import 'styles'

import React from 'react'
import { render } from 'react-dom'
import CozyClient from 'cozy-client'

import store from 'lib/store'
import schema from 'lib/schema'
import 'cozy-ui/transpiled/react/stylesheet.css'

const renderApp = function({ client, lang }) {
  const Root = require('ducks/components/Root').default
  render(
    <Root client={client} store={store} lang={lang} />,
    document.querySelector('[role=application]')
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const protocol = window.location.protocol
  const client = new CozyClient({
    uri: `${protocol}//${data.cozyDomain}`,
    schema,
    token: data.cozyToken
  })
  cozy.bar.init({
    cozyClient: client,
    appEditor: data.cozyAppEditor,
    appName: data.cozyAppName,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
  })

  renderApp({ client, lang: data.cozyLocale })
})
