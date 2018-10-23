import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'

import AppRoute from './AppRoute'
import ChannelRoute from './ChannelRoute'
import PermissionsRoute from './PermissionsRoute'
import ConfigureRoute from './ConfigureRoute'
import InstallRoute from './InstallRoute'
import UninstallRoute from './UninstallRoute'

export class ApplicationRouting extends Component {
  getAppFromMatchOrSlug = (match, slug) => {
    const appsArray = this.props.apps || this.props.installedApps || []
    const appSlug = slug || (match && match.params && match.params.appSlug)
    if (!appsArray.length || !appSlug) return null
    const app = appsArray.find(app => app.slug === appSlug)
    return app
  }

  redirectTo = target => {
    return this.props.history.replace(target)
  }

  render() {
    const {
      fetchLatestApp,
      isFetching,
      isAppFetching,
      isInstalling,
      isUninstalling,
      parent,
      actionError,
      fetchError
    } = this.props
    return (
      <div>
        <AppRoute
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          parent={parent}
          redirectTo={this.redirectTo}
        />
        <ChannelRoute
          actionError={actionError}
          fetchError={fetchError}
          fetchLatestApp={fetchLatestApp}
          getApp={this.getAppFromMatchOrSlug}
          isAppFetching={isAppFetching}
          isFetching={isFetching}
          isInstalling={isInstalling}
          parent={parent}
          redirectTo={this.redirectTo}
        />
        <InstallRoute
          actionError={actionError}
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          isInstalling={isInstalling}
          parent={parent}
          redirectTo={this.redirectTo}
        />
        <UninstallRoute
          actionError={actionError}
          getApp={this.getAppFromMatchOrSlug}
          isFetching={isFetching}
          isUninstalling={isUninstalling}
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
