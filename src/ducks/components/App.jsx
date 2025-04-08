import { initApp, restoreAppIfSaved } from 'ducks/apps'
import { AppRouter } from 'ducks/components/AppRouter'
import PushBanner from 'ducks/components/PushBanner'
import Sidebar from 'ducks/components/Sidebar'
import compose from 'lodash/flowRight'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { BarComponent } from 'cozy-bar'
import { withClient } from 'cozy-client'
import CozyDevTools from 'cozy-devtools'
import flag from 'cozy-flags'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout, Main } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
  }

  render() {
    return (
      <BreakpointsProvider>
        <Layout>
          <BarComponent replaceTitleOnMobile disableInternalStore />
          {flag('debug') && <CozyDevTools />}
          <Alerter />
          <Sidebar />
          <Main>
            {!flag('cozy.pushbanners.hide') && <PushBanner />}
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
  translate(),
  withClient,
  connect(mapStateToProps, mapDispatchToProps)
)(App)
