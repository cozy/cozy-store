import 'styles'

import { Provider } from 'react-redux'
import React from 'react'
import { render } from 'react-dom'
import reduxConfig from 'lib/store'

import CozyClient, { CozyProvider } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/I18n'
import flag from 'cozy-flags'

import IntentHandler from '../../ducks/components/intents/IntentHandler'
import InstallAppIntent from '../../ducks/components/intents/InstallAppIntent'
import schema from 'lib/schema'

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
  const configRedux = reduxConfig()
  render(
    <I18n
      lang={appData.locale}
      dictRequire={lang => require(`../../locales/${lang}`)}
    >
      <CozyProvider store={configRedux.store} client={client}>
        <Provider store={configRedux.store}>
          <IntentHandler appData={appData}>
            <InstallAppIntent action="INSTALL" type="io.cozy.apps" />
          </IntentHandler>
        </Provider>
      </CozyProvider>
    </I18n>,
    document.querySelector('[role=application]')
  )
})
