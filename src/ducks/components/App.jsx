import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import flag, { FlagSwitcher } from 'cozy-flags'

import IntentRedirect from 'ducks/components/intents/IntentRedirect'
import Sidebar from 'ducks/components/Sidebar'

import { initApp, restoreAppIfSaved } from 'ducks/apps'
import { Discover, MyApplications } from 'ducks/apps/Containers'

import { Layout, Main } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import compose from 'lodash/flowRight'
import { withClient } from 'cozy-client'

import { enabledPages } from 'config'

const componentsMap = {
  discover: Discover,
  myapps: MyApplications
}

export class App extends Component {
  constructor(props) {
    super(props)
    props.initApp() // fetch apps without icons
  }

  render() {
    const defaultPart = enabledPages ? enabledPages[0] : 'discover'
    return (
      <BreakpointsProvider>
        <Layout>
          {flag('switcher') && <FlagSwitcher />}
          <Alerter />
          <Sidebar />
          <Main>
            <Switch>
              <Route path="/redirect" component={IntentRedirect} />
              {enabledPages.map(name => {
                if (componentsMap[name]) {
                  return (
                    <Route
                      path={`/${name}`}
                      component={componentsMap[name]}
                      key={name}
                    />
                  )
                }
              })}
              {defaultPart && (
                <Fragment>
                  <Redirect exact from="/" to={`/${defaultPart}`} />
                  <Redirect from="*" to={`/${defaultPart}`} />
                </Fragment>
              )}
            </Switch>
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
  hot(module),
  withRouter,
  translate(),
  withClient,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App)
