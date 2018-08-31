import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'

import IntentModal from 'cozy-ui/react/IntentModal'
import { translate } from 'cozy-ui/react/I18n'
import Alerter from 'cozy-ui/react/Alerter'

import PermissionsModal from './PermissionsModal'
import UninstallModal from './UninstallModal'
import InstallModal from './InstallModal'
import ApplicationPage from './ApplicationPage'

import { APP_TYPE, REGISTRY_CHANNELS } from 'ducks/apps'

export class ApplicationRouting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInstallSuccess: false
    }
    this.getAppFromMatchOrSlug = this.getAppFromMatchOrSlug.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // don't react on error
    if (nextProps.actionError) return
    // on install success
    if (this.props.isInstalling && !nextProps.isInstalling) {
      const { history, location, parent, t } = this.props
      const pathRegex = new RegExp(`^/${parent}/([^/]*)/.*`)
      const matches = location.pathname.match(pathRegex)
      if (!matches || matches.length < 1) return history.replace(`/${parent}/`)
      const app = this.getAppFromMatchOrSlug(null, matches[1])
      if (app.type === APP_TYPE.KONNECTOR) {
        return history.replace(`/${parent}/${app.slug}/configure`)
      } else {
        Alerter.success(t('app_modal.install.message.install_success'), {
          duration: 3000
        })
        return history.replace(`/${parent}/${app.slug}`)
      }
    } else if (this.props.isUninstalling && !nextProps.isUninstalling) {
      const { history, location, parent, t } = this.props
      const pathRegex = new RegExp(`^/${parent}/([^/]*)/.*`)
      const matches = location.pathname.match(pathRegex)
      if (!matches || matches.length < 1) return history.replace(`/${parent}/`)
      const app = this.getAppFromMatchOrSlug(null, matches[1])
      Alerter.success(t('app_modal.uninstall.message.success'), {
        duration: 3000
      })
      return history.replace(`/${parent}/${app.slug}`)
    }
  }

  getAppFromMatchOrSlug(match, slug) {
    const appsArray = this.props.apps || this.props.installedApps || []
    const appSlug = slug || (match && match.params && match.params.appSlug)
    if (!appsArray.length || !appSlug) return null
    const app = appsArray.find(app => app.slug === appSlug)
    return app
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
        <Route
          path={`/${parent}/:appSlug`}
          render={({ match }) => {
            if (isFetching) return
            const app = this.getAppFromMatchOrSlug(match)
            if (!app) return history.replace(`/${parent}`)
            return <ApplicationPage app={app} parent={parent} />
          }}
        />
        <Route
          path={`/${parent}/:appSlug/channel/:channel`}
          render={({ match }) => {
            if (isFetching) return
            const app = this.getAppFromMatchOrSlug(match)
            if (!app || !app.isInRegistry) return history.replace(`/${parent}`)
            const channel = match.params.channel
            const isChannelAvailable = Object.values(
              REGISTRY_CHANNELS
            ).includes(channel)
            if (!isChannelAvailable) {
              return history.replace(`/${parent}/${app.slug}/manage`)
            }
            return (
              <InstallModal
                installApp={app.installed ? updateApp : installApp}
                parent={`/${parent}`}
                fetchApp={chan => fetchLatestApp(app.slug, chan)}
                isAppFetching={isAppFetching}
                installError={actionError}
                fetchError={fetchError}
                app={app}
                isInstalling={isInstalling}
                channel={channel}
              />
            )
          }}
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
        <Route
          path={`/${parent}/:appSlug/permissions`}
          render={({ match }) => {
            if (isFetching) return
            const app = this.getAppFromMatchOrSlug(match)
            if (!app) return history.replace(`/${parent}`)
            return <PermissionsModal app={app} parent={`/${parent}`} />
          }}
        />
        <Route
          path={`/${parent}/:appSlug/configure`}
          render={({ match }) => {
            if (isFetching) return
            const app = this.getAppFromMatchOrSlug(match)
            if (!app) return history.replace(`/${parent}`)
            const goToApp = () => history.replace(`/${parent}/${app.slug}`)
            if (app && app.installed && app.type === APP_TYPE.KONNECTOR) {
              return (
                <IntentModal
                  action="CREATE"
                  doctype="io.cozy.accounts"
                  options={{ slug: app.slug }}
                  dismissAction={goToApp}
                  onComplete={goToApp}
                  mobileFullscreen
                  overflowHidden
                  size="small"
                  height="35rem"
                />
              )
            } else {
              return goToApp()
            }
          }}
        />
      </div>
    )
  }
}

export default withRouter(translate()(ApplicationRouting))
