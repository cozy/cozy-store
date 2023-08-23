import {
  APP_TYPE,
  getAppBySlug,
  installAppFromRegistry,
  initAppIntent,
  getRegistryApps,
  initApp
} from 'ducks/apps'
import InstallAppIntentContent from 'ducks/components/intents/InstallAppIntentContent'
import { isPermissionsPageToDisplay } from 'ducks/components/intents/helpers'
import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import IntentHeader from 'cozy-ui/transpiled/react/IntentHeader'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

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
    const { data } = this.props
    if (isPermissionsPageToDisplay(data)) {
      this.props.initAppIntent()
    } else {
      this.props.initApp()
    }
  }

  installApp() {
    const { app, isInstalling, isFetching, fetchError } = this.props
    const isReady = !isInstalling && !isFetching && !fetchError

    if (isReady) {
      return this.props.installApp(app)
    }
  }

  async componentDidUpdate(prevProps) {
    // When the intent should display the page of a connector/app
    if (this.props.data.slug) {
      window.location.replace(`#/discover/${this.props.data.slug}`)
    }

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

      if (app.type === APP_TYPE.KONNECTOR) {
        if (enableConfiguration) {
          await compose(
            'CREATE',
            'io.cozy.accounts',
            { slug: app.slug }
          )
        } else {
          return this.handleTerminate(app)
        }
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
      data,
      appData,
      fetchError,
      installError,
      isFetching,
      isAppFetching,
      t
    } = this.props
    const { hasWebappSucceed } = this.state
    const { category } = data || {}

    const fetching = isFetching || isAppFetching
    const isReady = !fetchError && !fetching && !isAppFetching
    const isInstalled = app && app.installed

    const appError = isReady && !app && !category
    const errors = {
      alreadyInstalledError: isInstalled,
      fetchError,
      installError,
      appError
    }
    const errorKey = Object.keys(errors).reduce(
      (final, key) => (errors[key] ? errorKeys[key] : final),
      null
    )
    const error = !!errorKey && new Error(t(errorKey))
    const isReadyWithoutErrors = isReady && !error

    return (
      <div className="coz-intent-wrapper">
        <IntentHeader
          appEditor={appData.app.editor}
          appName={appData.app.name}
          appIcon={`../${appData.app.icon}`}
        />
        <div className={`coz-intent-content${fetching ? ' --loading' : ''}`}>
          {fetching && <Spinner size="xxlarge" noMargin />}
          {error && <div className="coz-error">{error.message}</div>}
          {isReadyWithoutErrors && (
            <InstallAppIntentContent
              {...this.props}
              isInstalled={isInstalled}
              hasWebappSucceed={hasWebappSucceed}
            />
          )}
        </div>
      </div>
    )
  }
}

InstallAppIntent.propTypes = {
  appData: PropTypes.object.isRequired,
  onTerminate: PropTypes.func.isRequired,
  data: PropTypes.object,
  dismissAction: PropTypes.func,
  onInstalled: PropTypes.func,
  redirectToApp: PropTypes.func,
  redirectToConfigure: PropTypes.func,
  /* With Redux */
  initAppIntent: PropTypes.func.isRequired,
  installApp: PropTypes.func.isRequired,
  isInstalling: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
  isFetching: PropTypes.bool.isRequired,
  isAppFetching: PropTypes.bool.isRequired,
  app: PropTypes.object,
  apps: PropTypes.array,
  fetchError: PropTypes.object,
  installError: PropTypes.object,
  /* With HOC */
  client: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.apps.isFetching,
  isAppFetching: state.apps.isAppFetching,
  isInstalling: state.apps.isInstalling,
  installError: state.apps.actionError,
  fetchError: state.apps.fetchError,
  app: getAppBySlug(state, ownProps.data.slug),
  apps: getRegistryApps(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  initAppIntent: () => {
    dispatch(initAppIntent(ownProps.client, ownProps.lang, ownProps.data.slug))
  },
  initApp: () => {
    dispatch(initApp(ownProps.client, ownProps.lang))
  },
  installApp: (app, channel) => dispatch(installAppFromRegistry(app, channel))
})

// translate last to pass the lang property to fetchApps()
export default compose(
  withClient,
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InstallAppIntent)
