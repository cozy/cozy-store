// cozy-ui css import should be done before any other import
// otherwise the themes will not be supplied and the app crashes
// eslint-disable-next-line import/order
import 'cozy-ui/dist/cozy-ui.utils.min.css'
// eslint-disable-next-line import/order
import 'cozy-ui/transpiled/react/stylesheet.css'

import { captureConsoleIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import schema from 'lib/schema'
import { configureStore } from 'lib/store'
import React from 'react'
import { render } from 'react-dom'
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from 'react-router-dom'
import 'styles'

import 'cozy-bar/dist/stylesheet.css'
import 'cozy-search/dist/stylesheet.css'
import CozyClient from 'cozy-client'
import flag from 'cozy-flags'
import { RealtimePlugin } from 'cozy-realtime'

import manifest from '../../../manifest.webapp'

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

  client.registerPlugin(RealtimePlugin)
  client.registerPlugin(flag.plugin)

  const lang = data.locale

  const store = configureStore({ client })
  const Root = require('ducks/components/Root').default

  Sentry.init({
    dsn: 'https://facf9d254f2513714c781ff0d416c7cf@errors.cozycloud.cc/76',
    environment: process.env.NODE_ENV,
    release: manifest.version,
    integrations: [
      captureConsoleIntegration({ levels: ['error'] }), // We also want to capture the `console.error` to, among other things, report the logs present in the `try/catch`
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      })
    ],
    tracesSampleRate: 0.1,
    // React log these warnings(bad Proptypes), in a console.error, it is not relevant to report this type of information to Sentry
    ignoreErrors: [/^Warning: /]
  })

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
