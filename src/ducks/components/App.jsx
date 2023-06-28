import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/flowRight'

import flag, { FlagSwitcher } from 'cozy-flags'
import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Layout, Main } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { initApp, restoreAppIfSaved } from 'ducks/apps'
import { AppRouter } from 'ducks/components/AppRouter'
import PushBannersLoader from 'ducks/components/PushBanners'
import Sidebar from 'ducks/components/Sidebar'

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
            {!flag('cozy.pushbanners.hide') && <PushBannersLoader />}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App)
