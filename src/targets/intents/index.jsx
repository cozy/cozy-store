/* eslint-disable import/order */
import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'styles'

import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import InstallAppIntent from 'ducks/components/intents/InstallAppIntent'
import IntentHandler from 'ducks/components/intents/IntentHandler'
import schema from 'lib/schema'
import { configureStore } from 'lib/store'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import CozyClient, { CozyProvider } from 'cozy-client'
import flag from 'cozy-flags'
import I18n from 'cozy-ui/transpiled/react/I18n'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const appData = JSON.parse(root.dataset.cozy)

  const protocol = window.location.protocol
  const client = new CozyClient({
    uri: `${protocol}//${appData.domain}`,
    schema,
    token: appData.token,
    store: false
  })
  client.registerPlugin(flag.plugin)

  const store = configureStore({ client })

  render(
    <I18n
      lang={appData.locale}
      dictRequire={lang => require(`../../locales/${lang}`)}
    >
      <Provider store={store}>
        <CozyProvider client={client}>
          <BreakpointsProvider>
            <IntentHandler appData={appData}>
              <InstallAppIntent action="INSTALL" type="io.cozy.apps" />
            </IntentHandler>
          </BreakpointsProvider>
        </CozyProvider>
      </Provider>
    </I18n>,
    document.querySelector('[role=application]')
  )
})
