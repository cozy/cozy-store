/* global cozy */

import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'

import 'styles'

import React from 'react'
import { render } from 'react-dom'
import CozyClient from 'cozy-client'
import flag from 'cozy-flags'

import store from 'lib/store'
import schema from 'lib/schema'

const renderApp = function({ client, lang }) {
  const Root = require('ducks/components/Root').default
  render(
    <Root client={client} store={store} lang={lang} />,
    document.querySelector('[role=application]')
  )
}

window.flag = flag

let client, lang

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const protocol = window.location.protocol

  client = new CozyClient({
    uri: `${protocol}//${data.cozyDomain}`,
    schema,
    token: data.cozyToken
  })

  client.registerPlugin(flag.plugin)

  lang = data.cozyLocale

  cozy.bar.init({
    cozyClient: client,
    appEditor: data.cozyAppEditor,
    appName: data.cozyAppName,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
  })

  renderApp({ client, lang })
})

if (module.hot) {
  renderApp({ client, lang })
  module.hot.accept()
}
