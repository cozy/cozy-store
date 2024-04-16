// cozy-ui css import should be done before any other import
// otherwise the themes will not be supplied and the app crashes
// eslint-disable-next-line import/order
import 'cozy-ui/dist/cozy-ui.utils.min.css'
// eslint-disable-next-line import/order
import 'cozy-ui/transpiled/react/stylesheet.css'

import schema from 'lib/schema'
import { configureStore } from 'lib/store'
import React from 'react'
import { render } from 'react-dom'
import 'styles'

import 'cozy-bar/dist/stylesheet.css'
import CozyClient from 'cozy-client'
import flag from 'cozy-flags'

window.flag = flag

const init = () => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)
  const protocol = window.location.protocol

  const client = new CozyClient({
    uri: `${protocol}//${data.domain}`,
    schema,
    token: data.token,
    store: false
  })

  client.registerPlugin(flag.plugin)

  const lang = data.locale

  const store = configureStore({ client })
  const Root = require('ducks/components/Root').default

  render(
    <Root client={client} store={store} lang={lang} />,
    document.querySelector('[role=application]')
  )
}

document.addEventListener('DOMContentLoaded', () => {
  init()
})

if (module.hot) {
  init
  module.hot.accept()
}
