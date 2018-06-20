import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'

import IntentRedirect from './intents/IntentRedirect'
import Sidebar from './Sidebar'

import { initApp, fetchIconsProgressively } from '../apps'
import { Discover, MyApplications } from '../apps/Containers'

import Alerter from 'cozy-ui/react/Alerter'

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching) {
      this.props.fetchIconsProgressively()
    }
  }

  render() {
    return (
      <div className="app-wrapper o-layout--2panes">
        <Alerter />
        <Sidebar />
        <main className="app-content">
          <Switch>
            <Route path="/redirect" component={IntentRedirect} />
            <Route path="/discover" component={Discover} />
            <Route path="/myapps" component={MyApplications} />
            <Redirect exact from="/" to="/discover" />
            <Redirect from="*" to="/discover" />
          </Switch>
        </main>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.apps.isFetching
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  initApp: () => dispatch(initApp(ownProps.lang)),
  fetchIconsProgressively: () => dispatch(fetchIconsProgressively())
})

export default withRouter(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)
  )
)
