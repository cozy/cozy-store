import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import IntentRedirect from './intents/IntentRedirect'
import Sidebar from './Sidebar'

import { initApp } from '../apps'
import { Discover, MyApplications } from '../apps/Containers'

import { Layout, Main } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { IconSprite } from 'cozy-ui/transpiled/react'

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
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
  initApp: () => dispatch(initApp(ownProps.lang))
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
