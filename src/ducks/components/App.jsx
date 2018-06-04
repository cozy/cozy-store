import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'

import Sidebar from './Sidebar'

import { fetchApps } from '../apps'
import { Discover, MyApplications } from '../apps/Containers'

import Alerter from 'cozy-ui/react/Alerter'

export class App extends Component {
  constructor(props) {
    super(props)
    props.fetchApps()
  }

  render() {
    return (
      <div className="app-wrapper o-layout--2panes">
        <Alerter />
        <Sidebar />
        <main className="app-content">
          <Switch>
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

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps(ownProps.lang))
})

export default withRouter(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)
  )
)
