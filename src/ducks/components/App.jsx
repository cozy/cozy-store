import 'url-search-params-polyfill'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'

import IntentRedirect from './intents/IntentRedirect'
import Sidebar from './Sidebar'

import { initApp, fetchIconsProgressively } from '../apps'
import { Discover, MyApplications } from '../apps/Containers'
import { setFilter } from 'ducks/filter'

import { Layout, Main } from 'cozy-ui/react/Layout'
import Alerter from 'cozy-ui/react/Alerter'

export function queryStringToObject(search) {
  const searchParams = new URLSearchParams(search)
  const searchObject = {}
  for (const pair of searchParams) {
    searchObject[pair[0]] = pair[1]
  }
  return searchObject
}

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
    props.setFilter(queryStringToObject(props.location.search))
  }

  componentDidUpdate() {
    const { setFilter, location } = this.props
    if (location.search) {
      setFilter(queryStringToObject(location.search))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching) {
      this.props.fetchIconsProgressively()
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
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.apps.isFetching
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  initApp: () => dispatch(initApp(ownProps.lang)),
  fetchIconsProgressively: () => dispatch(fetchIconsProgressively()),
  setFilter: filter => dispatch(setFilter(filter))
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
