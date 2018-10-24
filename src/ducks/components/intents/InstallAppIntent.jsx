import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import AppInstallation from '../../apps/components/AppInstallation'
import IntentHeader from 'cozy-ui/react/IntentHeader'
import Spinner from 'cozy-ui/react/Spinner'

import { getAppBySlug, installAppFromRegistry, initAppIntent } from '../../apps'

const errorKeys = {
  alreadyInstalledError: 'intent.install.error.installed',
  fetchError: 'intent.install.error.fetch',
  installError: 'intent.install.error.install',
  appError: 'intent.install.error.unavailable'
}

export class InstallAppIntent extends Component {
  state = {
    status: ''
  }

  constructor(props) {
    super(props)
    props.initAppIntent()
  }

  installApp() {
    const { app, data, isInstalling, isFetching, fetchError } = this.props
    const isReady = !isInstalling && !isFetching && !fetchError

    if (isReady) {
      return this.props.installApp(data.slug, app.type)
    }
  }

  componentWillReceiveProps(nextProps) {
    // on install success
    if (this.props.isInstalling && !nextProps.isInstalling) {
      this.props.onTerminate(nextProps.app)
      this.setState({
        status: 'installed'
      })
    }
  }

  render() {
    const {
      app,
      appData,
      fetchError,
      installError,
      isFetching,
      isAppFetching,
      isInstalling,
      onCancel,
      t
    } = this.props

    const { status } = this.state

    const fetching = isFetching || isAppFetching
    const isReady = !fetchError && !fetching && !isAppFetching
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
          {fetching && <Spinner size="xxlarge" />}
          {error && <div className="coz-error">{error.message}</div>}
          {isReady &&
            !isInstalled &&
            !error && (
              <AppInstallation
                appSlug={app.slug}
                installApp={() => this.installApp()}
                isInstalling={isInstalling}
                onCancel={onCancel}
              />
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.apps.isFetching,
  isAppFetching: state.apps.isAppFetching,
  isInstalling: state.apps.isInstalling,
  installError: state.apps.actionError,
  fetchError: state.apps.fetchError,
  app: getAppBySlug(state, ownProps.data.slug)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  initAppIntent: () => {
    dispatch(initAppIntent(ownProps.lang, ownProps.data.slug))
  },
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
