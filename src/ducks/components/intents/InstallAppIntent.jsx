import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import AppInstallation from '../../apps/components/AppInstallation'
import IntentHeader from 'cozy-ui/react/IntentHeader'
import Spinner from 'cozy-ui/react/Spinner'

import {
  fetchApps,
  fetchInstalledApps,
  getAppBySlug,
  installAppFromRegistry
} from '../../apps'

const errorKeys = {
  alreadyInstalledError: 'intent.install.error.installed',
  fetchError: 'intent.install.error.fetch.title',
  installError: 'intent.install.error.install',
  appError: 'intent.install.error.unavailable'
}

export class InstallAppIntent extends Component {
  constructor(props) {
    super(props)
    props.fetchApps()
  }

  installApp() {
    const { app, data, isInstalling, isFetching, fetchError } = this.props
    const isReady = !isInstalling && !isFetching && !fetchError

    if (isReady) {
      return this.props.installApp(data.slug, app.type)
    }
  }

  onSuccess(app) {
    this.props.onTerminate(app)
    this.setState({
      status: 'installed'
    })
  }

  render() {
    const {
      app,
      appData,
      fetchError,
      installError,
      isFetching,
      isInstalling,
      onCancel,
      t
    } = this.props

    const { status } = this.state

    const isReady = !fetchError && !isFetching
    const isInstalled = status === 'installed'

    const appError = isReady && !app
    const alreadyInstalledError = !isInstalled && app && app.installed
    const errors = { alreadyInstalledError, fetchError, installError, appError }
    const errorKey = Object.keys(errors).reduce(
      (final, key) => (errors[key] ? errorKeys[key] : final),
      null
    )
    const error = !!errorKey && new Error(t(errorKey))

    return (
      <div className="coz-intent-wrapper">
        <IntentHeader
          appEditor={appData.cozyAppEditor}
          appName={appData.cozyAppName}
          appIcon={`../${appData.cozyIconPath}`}
        />
        <div className="coz-intent-content">
          {isFetching && <Spinner size="xxlarge" />}
          {error && <div className="coz-error">{error.message}</div>}
          {isReady &&
            !isInstalled &&
            !error && (
              <AppInstallation
                app={app}
                installApp={() => this.installApp()}
                isInstalling={isInstalling}
                onCancel={onCancel}
                onSuccess={app => this.onSuccess(app)}
              />
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.apps.isFetching,
  isInstalling: state.apps.isInstalling,
  installError: state.apps.actionError,
  fetchError: state.apps.fetchError,
  app: getAppBySlug(state, ownProps.data.slug)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps(ownProps.lang)),
  fetchInstalledApps: () => dispatch(fetchInstalledApps(ownProps.lang)),
  installApp: (appSlug, appType, channel) =>
    dispatch(installAppFromRegistry(appSlug, appType, channel))
})

// translate last to pass the lang property to fetchApps()
export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InstallAppIntent)
)
