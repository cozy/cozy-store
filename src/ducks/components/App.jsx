import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'
import flag, { FlagSwitcher } from 'cozy-flags'

import IntentRedirect from './intents/IntentRedirect'
import Sidebar from './Sidebar'

import { initApp, restoreAppIfSaved } from '../apps'
import { Discover, MyApplications } from '../apps/Containers'

import { Layout, Main } from 'cozy-ui/react/Layout'
import Alerter from 'cozy-ui/react/Alerter'
import { IconSprite } from 'cozy-ui/react'

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
  }

  render() {
    return (
      <Layout>
        {flag('switcher') && <FlagSwitcher />}
        <Alerter />
        <Sidebar />
        <Main>
          <Switch>
            <Route path="/redirect" component={IntentRedirect} />
            <Route path="/discover" component={Discover} />
            <Route path="/myapps" component={MyApplications} />
            <Redirect exact from="/" to="/discover" />
            <Redirect from="*" to="/discover" />
          </Switch>
        </Main>
        <IconSprite />
      </Layout>
    )
  }
}

export const mapStateToProps = state => ({
  isFetching: state.apps.isFetching,
  isInstalling: state.apps.isInstalling
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  initApp: () => dispatch(initApp(ownProps.lang)),
  restoreAppIfSaved: () => dispatch(restoreAppIfSaved())
})

export default hot(module)(
  withRouter(
    translate()(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(App)
    )
  )
)
