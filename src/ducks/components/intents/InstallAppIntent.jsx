import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  APP_TYPE,
  getAppBySlug,
  installAppFromRegistry,
  initAppIntent
} from 'ducks/apps'
import InstallAppIntentContent from 'ducks/components/InstallAppIntentContent'
import InstallAppIntentContentDeprecated from 'ducks/components/deprecated/InstallAppIntentContent'

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
    const { app, isInstalling, isFetching, fetchError } = this.props
    const isReady = !isInstalling && !isFetching && !fetchError

    if (isReady) {
      return this.props.installApp(app)
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
      data,
      fetchError,
      installError,
      isFetching,
      isAppFetching,
      isInstalling,
      onCancel,
      t
    } = this.props
    const { installAppIntentUpdated } = data || {}
    const { hasWebappSucceed } = this.state

    const fetching = isFetching || isAppFetching
    const isReady = !fetchError && !fetching && !isAppFetching
    const isInstalled = !!app?.installed

    const appError = isReady && !app
    const alreadyInstalledError = !isInstalled && app && app.installed
    const errors = { alreadyInstalledError, fetchError, installError, appError }
    const errorKey = Object.keys(errors).reduce(
      (final, key) => (errors[key] ? errorKeys[key] : final),
      null
    )
    const error = !!errorKey && new Error(t(errorKey))
    const isReadyWithoutErrors = isReady && !error

    if (installAppIntentUpdated) {
      return (
        <InstallAppIntentContent
          appData={appData}
          app={app}
          fetching={fetching}
          error={error}
          isReadyWithoutErrors={isReadyWithoutErrors}
          isInstalled={isInstalled}
          installApp={this.installApp}
          onTerminate={this.handleTerminate}
          isInstalling={isInstalling}
          onCancel={onCancel}
          hasWebappSucceed={hasWebappSucceed}
        />
      )
    }

    return (
      <InstallAppIntentContentDeprecated
        appData={appData}
        app={app}
        fetching={fetching}
        error={error}
        isReadyWithoutErrors={isReadyWithoutErrors}
        isInstalled={isInstalled}
        installApp={this.installApp}
        onTerminate={this.handleTerminate}
        isInstalling={isInstalling}
        onCancel={onCancel}
        hasWebappSucceed={hasWebappSucceed}
      />
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
    dispatch(initAppIntent(ownProps.client, ownProps.lang, ownProps.data.slug))
  },
  installApp: (app, channel) => dispatch(installAppFromRegistry(app, channel))
})

// translate last to pass the lang property to fetchApps()
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallAppIntent)
