import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import AppInstallation from 'ducks/apps/components/AppInstallation'
import InstallSuccess from 'ducks/apps/components/InstallSuccess'
import IntentHeader from 'cozy-ui/react/IntentHeader'
import Spinner from 'cozy-ui/react/Spinner'

import {
  APP_TYPE,
  getAppBySlug,
  installAppFromRegistry,
  initAppIntent
} from 'ducks/apps'

const errorKeys = {
  alreadyInstalledError: 'intent.install.error.installed',
  fetchError: 'intent.install.error.fetch',
  installError: 'intent.install.error.install',
  appError: 'intent.install.error.unavailable'
}

export class InstallAppIntent extends Component {
  state = {
    hasWebappSucceed: false,
    hasKonnectorSucceed: false
  }

  componentDidMount() {
    this.props.initAppIntent()
  }

  installApp() {
    const { app, data, isInstalling, isFetching, fetchError } = this.props
    const isReady = !isInstalling && !isFetching && !fetchError

    if (isReady) {
      return this.props.installApp(data.slug, app.type)
    }
  }

  async componentDidUpdate(prevProps) {
    // on install success
    const { hasWebappSucceed, hasKonnectorSucceed } = this.state
    const hasSucceed = hasWebappSucceed || hasKonnectorSucceed
    if (
      !hasSucceed &&
      ((prevProps.app && prevProps.app.installed) ||
        (this.props.app && this.props.app.installed))
    ) {
      const { app, compose, data } = this.props
      const enableConfiguration =
        data && (typeof data.configure === 'undefined' || data.configure)

      if (app.type === APP_TYPE.KONNECTOR && enableConfiguration) {
        await compose(
          'CREATE',
          'io.cozy.accounts',
          { slug: app.slug }
        )
      }

      this.onSuccess(enableConfiguration)
    }
  }

  onSuccess = enableConfiguration => {
    const { app, onTerminate } = this.props
    if (app.type === APP_TYPE.WEBAPP || !enableConfiguration) {
      this.setState(() => ({
        hasWebappSucceed: true
      }))
    } else {
      this.setState(() => ({
        hasKonnectorSucceed: true
      }))
      onTerminate(this.props.app)
    }
  }

  handleTerminate = () => {
    const { onTerminate, app } = this.props
    onTerminate(app)
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
    const { hasWebappSucceed } = this.state

    const fetching = isFetching || isAppFetching
    const isReady = !fetchError && !fetching && !isAppFetching
    const isInstalled = app && app.installed

    const appError = isReady && !app
    const alreadyInstalledError = !isInstalled && app && app.installed
    const errors = { alreadyInstalledError, fetchError, installError, appError }
    const errorKey = Object.keys(errors).reduce(
      (final, key) => (errors[key] ? errorKeys[key] : final),
      null
    )
    const error = !!errorKey && new Error(t(errorKey))
    const isReadyWithoutErrors = isReady && !error
    return (
      <div className="coz-intent-wrapper">
        <IntentHeader
          appEditor={appData.cozyAppEditor}
          appName={appData.cozyAppName}
          appIcon={`../${appData.cozyIconPath}`}
        />
        <div className={`coz-intent-content${fetching ? ' --loading' : ''}`}>
          {fetching && <Spinner size="xxlarge" noMargin />}
          {error && <div className="coz-error">{error.message}</div>}
          {isReadyWithoutErrors &&
            (!isInstalled ? (
              <AppInstallation
                appSlug={app.slug}
                installApp={() => this.installApp()}
                isInstalling={isInstalling}
                onCancel={onCancel}
              />
            ) : (
              hasWebappSucceed && (
                <InstallSuccess app={app} onTerminate={this.handleTerminate} />
              )
            ))}
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
