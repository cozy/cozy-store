import store from 'lib/store'
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import { CozyProvider, createMockClient } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import enLocale from '../src/locales/en.json'

const AppLike = ({ children, store, client }) => (
  <Provider store={store || (client && client.store)}>
    <CozyProvider client={client || createMockClient({})}>
      <I18n dictRequire={() => enLocale} lang="en">
        <BreakpointsProvider>
          <HashRouter>{children}</HashRouter>
        </BreakpointsProvider>
      </I18n>
    </CozyProvider>
  </Provider>
)

export default AppLike
