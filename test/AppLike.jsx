import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import { CozyProvider, createMockClient } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import store from 'lib/store'
import enLocale from '../src/locales/en.json'

const AppLike = ({ children, client }) => (
  <CozyProvider client={client || createMockClient({})}>
    <I18n dictRequire={() => enLocale} lang="en">
      <BreakpointsProvider>
        <Provider store={store}>
          <HashRouter>{children}</HashRouter>
        </Provider>
      </BreakpointsProvider>
    </I18n>
  </CozyProvider>
)

export default AppLike
