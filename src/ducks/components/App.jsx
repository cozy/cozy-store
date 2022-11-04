import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import flag, { FlagSwitcher } from 'cozy-flags'

import { AppRouter } from 'ducks/components/AppRouter'
import Sidebar from 'ducks/components/Sidebar'

import { initApp, restoreAppIfSaved } from 'ducks/apps'

import { Layout, Main } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import compose from 'lodash/flowRight'
import { withClient } from 'cozy-client'

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
  }

  render() {
    return (
      <BreakpointsProvider>
        <Layout>
          {flag('switcher') && <FlagSwitcher />}
          <Alerter />
          <Sidebar />
          <Main>
            <AppRouter />
          </Main>
          <IconSprite />
        </Layout>
      </BreakpointsProvider>
    )
  }
}

export const mapStateToProps = state => ({
  isFetching: state.apps.isFetching,
  isInstalling: state.apps.isInstalling
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  initApp: () => dispatch(initApp(ownProps.client, ownProps.lang)),
  restoreAppIfSaved: () => dispatch(restoreAppIfSaved())
})

export default compose(
  withRouter,
  translate(),
  withClient,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App)
