import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'
import Alerter from 'cozy-ui/react/Alerter'

import UninstallModal from '../UninstallModal'
import InstallModal from '../InstallModal'

import AppRoute from './AppRoute'
import ChannelRoute from './ChannelRoute'
import PermissionsRoute from './PermissionsRoute'
import ConfigureRoute from './ConfigureRoute'

import { APP_TYPE } from 'ducks/apps'

export class ApplicationRouting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInstallSuccess: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // don't react on error
    if (nextProps.actionError) return
    // on install success
    if (this.props.isInstalling && !nextProps.isInstalling) {
      const { location, parent, t } = this.props
      const pathRegex = new RegExp(`^/${parent}/([^/]*)/.*`)
      const matches = location.pathname.match(pathRegex)
      if (!matches || matches.length < 1) return this.redirectTo(`/${parent}/`)
      const app = this.getAppFromMatchOrSlug(null, matches[1])
      if (app.type === APP_TYPE.KONNECTOR) {
        return this.redirectTo(`/${parent}/${app.slug}/configure`)
      } else {
        Alerter.success(t('app_modal.install.message.install_success'), {
          duration: 3000
        })
        return this.redirectTo(`/${parent}/${app.slug}`)
      }
    } else if (this.props.isUninstalling && !nextProps.isUninstalling) {
      const { location, parent, t } = this.props
      const pathRegex = new RegExp(`^/${parent}/([^/]*)/.*`)
      const matches = location.pathname.match(pathRegex)
      if (!matches || matches.length < 1) return this.redirectTo(`/${parent}/`)
      const app = this.getAppFromMatchOrSlug(null, matches[1])
      Alerter.success(t('app_modal.uninstall.message.success'), {
        duration: 3000
      })
      return this.redirectTo(`/${parent}/${app.slug}`)
    }
  }

  getAppFromMatchOrSlug = (match, slug) => {
    const appsArray = this.props.apps || this.props.installedApps || []
    const appSlug = slug || (match && match.params && match.params.appSlug)
    if (!appsArray.length || !appSlug) return null
    const app = appsArray.find(app => app.slug === appSlug)
    return app
  }

  redirectTo = target => {
    return history.replace(target)
  }

  render() {
    const {
      fetchLatestApp,
      installApp,
      uninstallApp,
      updateApp,
      isFetching,
      isAppFetching,
      isInstalling,
      parent,
      history,
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
          installApp={installApp}
          isAppFetching={isAppFetching}
          isFetching={isFetching}
          isInstalling={isInstalling}
          parent={parent}
          redirectTo={this.redirectTo}
          updateApp={updateApp}
        />
        <Route
          path={`/${parent}/:appSlug/manage`}
          render={({ match }) => {
            if (isFetching) return
            const app = this.getAppFromMatchOrSlug(match)
            if (!app) return history.replace(`/${parent}`)
            if (app && app.installed && !app.availableVersion) {
              if (!app.uninstallable)
                return history.replace(`/${parent}/${app.slug}`)
              return (
                <UninstallModal
                  uninstallApp={uninstallApp}
                  parent={`/${parent}`}
                  uninstallError={actionError}
                  app={app}
                />
              )
            } else {
              return (
                <InstallModal
                  installApp={installApp}
                  parent={`/${parent}`}
                  installError={actionError}
                  app={app}
                  isInstalling={isInstalling}
                />
              )
            }
          }}
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
