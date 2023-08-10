import schema from 'lib/schema'
import store from 'lib/store'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'styles'

import CozyClient, { CozyProvider } from 'cozy-client'
import flag from 'cozy-flags'
import I18n from 'cozy-ui/transpiled/react/I18n'

import InstallAppIntent from '../../ducks/components/intents/InstallAppIntent'
import IntentHandler from '../../ducks/components/intents/IntentHandler'

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

  render(
    <I18n
      lang={appData.locale}
      dictRequire={lang => require(`../../locales/${lang}`)}
    >
      <CozyProvider store={store} client={client}>
        <Provider store={store}>
          <IntentHandler appData={appData}>
            <InstallAppIntent action="INSTALL" type="io.cozy.apps" />
          </IntentHandler>
        </Provider>
      </CozyProvider>
    </I18n>,
    document.querySelector('[role=application]')
  )
})
