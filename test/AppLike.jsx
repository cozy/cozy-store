import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import I18n from 'twake-i18n'

import { CozyProvider, createMockClient } from 'cozy-client'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import enLocale from '../src/locales/en.json'

const AppLike = ({ children, store, client }) => {
  const mockClient = createMockClient({})
  return (
    <Provider
      store={
        store || (client && client.store) || (mockClient && mockClient.store)
      }
    >
      <CozyProvider client={client || mockClient}>
        <I18n dictRequire={() => enLocale} lang="en">
          <BreakpointsProvider>
            <HashRouter>
              <Layout>{children}</Layout>
            </HashRouter>
          </BreakpointsProvider>
        </I18n>
      </CozyProvider>
    </Provider>
  )
}
export default AppLike
