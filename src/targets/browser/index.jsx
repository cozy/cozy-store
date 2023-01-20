import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'

import 'styles'

import React from 'react'
import { createRoot } from 'react-dom/client'

import store from 'lib/store'
import setupApp from './setupApp'

const renderApp = function() {
  const { container, client, lang } = setupApp()
  const root = createRoot(container)

  const Root = require('ducks/components/Root').default
  root.render(<Root client={client} store={store} lang={lang} />)
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp()
})

if (module.hot) {
  renderApp()
  module.hot.accept()
}
