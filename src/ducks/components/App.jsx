import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'

import IntentRedirect from './intents/IntentRedirect'
import Sidebar from './Sidebar'

import { initApp, restoreSavedApp } from '../apps'
import { Discover, MyApplications } from '../apps/Containers'

import { Layout, Main } from 'cozy-ui/react/Layout'
import Alerter from 'cozy-ui/react/Alerter'
import { IconSprite } from 'cozy-ui/react'

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
  }

  componentDidUpdate(prevProps) {
    if (!this.props.location) return
    // quitting channel modal, so we restore the previous app state
    if (
      this.props.location.pathname !== prevProps.location.pathname &&
      prevProps.location.pathname.match(/.*\/(channel\/|install).*/)
    ) {
      this.props.restoreSavedApp()
    }
  }

  render() {
    return (
      <Layout>
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

const mapStateToProps = state => ({
  isFetching: state.apps.isFetching
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  initApp: () => dispatch(initApp(ownProps.lang)),
  restoreSavedApp: () => dispatch(restoreSavedApp())
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
