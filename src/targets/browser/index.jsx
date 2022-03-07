/* global cozy */

import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'

import 'styles'

import React from 'react'
import { render } from 'react-dom'
import CozyClient from 'cozy-client'
import flag from 'cozy-flags'

import reduxConfig from 'lib/store'
import schema from 'lib/schema'

const renderApp = function({ client, lang, configRedux }) {
  const Root = require('ducks/components/Root').default
  render(
    <Root client={client} store={configRedux.store} lang={lang} />,
    document.querySelector('[role=application]')
  )
}

window.flag = flag

let client, lang

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)
  const protocol = window.location.protocol

  client = new CozyClient({
    uri: `${protocol}//${data.domain}`,
    schema,
    token: data.token
  })

  client.registerPlugin(flag.plugin)

  lang = data.locale

  cozy.bar.init({
    cozyClient: client,
    appEditor: data.app.editor,
    appName: data.app.name,
    iconPath: data.app.icon,
    lang: data.locale,
    replaceTitleOnMobile: true
  })
  const configRedux = reduxConfig()

  renderApp({ client, lang, configRedux })
})

if (module.hot) {
  renderApp({ client, lang })
  module.hot.accept()
}
