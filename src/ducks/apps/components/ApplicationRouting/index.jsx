import React, { Component } from 'react'
import { withRouter, Route } from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'

import ChannelRoute from 'ducks/apps/components/ApplicationRouting/ChannelRoute'
import PermissionsRoute from 'ducks/apps/components/ApplicationRouting/PermissionsRoute'
import ConfigureRoute from 'ducks/apps/components/ApplicationRouting/ConfigureRoute'
import InstallRoute from 'ducks/apps/components/ApplicationRouting/InstallRoute'
import UninstallRoute from 'ducks/apps/components/ApplicationRouting/UninstallRoute'
import ApplicationPage from 'ducks/apps/components/ApplicationPage'

export class ApplicationRouting extends Component {
  mainPage = React.createRef()

  getAppFromMatchOrSlug = (match, slug) => {
    const appsArray = this.props.apps || this.props.installedApps || []
    const appSlug = slug || (match && match.params && match.params.appSlug)
    if (!appsArray.length || !appSlug) return null
    const app = appsArray.find(app => app.slug === appSlug)
    return app
  }

  redirectTo = target => {
    const { history, location } = this.props
    history.replace(target + location.search)
    return null
  }

  render() {
    const { isFetching, parent } = this.props
    return (
      <div className="sto-modal-page" ref={this.mainPage}>
        <Route
          path={`/${parent}/:appSlug`}
          render={({ match }) => {
            return (
              <ApplicationPage
                matchRoute={match}
                parent={parent}
                pauseFocusTrap={!match.isExact}
                isFetching={isFetching}
                getApp={this.getAppFromMatchOrSlug}
                redirectTo={this.redirectTo}
                mainPageRef={this.mainPage}
                konnectorOpenUri={this.props.konnectorOpenUri}
              />
            )
          }}
        />
        <ChannelRoute
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          parent={parent}
          redirectTo={this.redirectTo}
        />
        <InstallRoute
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          parent={parent}
          redirectTo={this.redirectTo}
          konnectorOpenUri={this.props.konnectorOpenUri}
        />
        <UninstallRoute
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          parent={parent}
          redirectTo={this.redirectTo}
        />
        <PermissionsRoute
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          parent={parent}
          redirectTo={this.redirectTo}
        />
        <ConfigureRoute
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          parent={parent}
          redirectTo={this.redirectTo}
        />
      </div>
    )
  }
}

export default withRouter(translate()(ApplicationRouting))
