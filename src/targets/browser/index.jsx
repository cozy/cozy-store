import schema from 'lib/schema'
import store from 'lib/store'
import React from 'react'
import { render } from 'react-dom'
import 'styles'

import 'cozy-bar/dist/stylesheet.css'
import CozyClient from 'cozy-client'
import flag from 'cozy-flags'
import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'

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
  const data = JSON.parse(root.dataset.cozy)
  const protocol = window.location.protocol

  client = new CozyClient({
    uri: `${protocol}//${data.domain}`,
    schema,
    token: data.token
  })

  client.registerPlugin(flag.plugin)

  lang = data.locale

  // replaceTitleOnMobile: true

  renderApp({ client, lang })
})

if (module.hot) {
  renderApp({ client, lang })
  module.hot.accept()
}
