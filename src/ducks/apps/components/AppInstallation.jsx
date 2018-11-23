import React, { Component } from 'react'

import { connect } from 'react-redux'
import { PropTypes } from 'react-proptypes'

import getChannel from 'lib/getChannelFromSource'
import {
  ModalDescription,
  ModalHeader,
  ModalFooter
} from 'cozy-ui/transpiled/react/Modal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import PermissionsList from './PermissionsList'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { hasPendingUpdate } from 'ducks/apps/appStatus'

import { APP_TYPE, getAppBySlug, installAppFromRegistry } from 'ducks/apps'

export class AppInstallation extends Component {
  installApp = async () => {
    this.setState({ error: null })
    const { app, channel, installApp, onError } = this.props
    try {
      await installApp(app.slug, app.type, channel, app.installed)
    } catch (error) {
      if (onError) return onError(error)
      throw error
    }
  }

  componentDidUpdate = prevProps => {
    const { app, channel, onSuccess, t } = this.props
    const justInstalled =
      prevProps.app && !prevProps.app.installed && app.installed
    const justSwitchedChannel =
      channel &&
      prevProps.app &&
      prevProps.app.source &&
      getChannel(prevProps.app.source) === channel
    const succeed = justInstalled || justSwitchedChannel
    if (succeed) {
      if (app.type === APP_TYPE.WEBAPP) {
        Alerter.success(t('app_modal.install.message.install_success'), {
          duration: 3000
        })
      }
      if (typeof onSuccess === 'function') onSuccess()
    }
  }

  render() {
    const {
      app,
      fetchError,
      installError,
      isFetching,
      isInstalling,
      isCanceling,
      onCancel,
      t
    } = this.props
    const appName = t(`apps.${app.slug}.name`, {
      _: app.name
    })
    const permissions = app.permissions || {}
    const isFirstLoading = isFetching && !isCanceling

    return (
      <React.Fragment>
        <ModalHeader title={t('app_modal.install.title')} />
        {isFirstLoading ? (
          <ModalDescription>
            <div className="sto-install-loading">
              <Spinner size="xlarge" />
            </div>
          </ModalDescription>
        ) : (
          <ModalDescription>
            {permissions && <PermissionsList app={app} appName={appName} />}
            {fetchError && (
              <p className="u-error">
                {t('app_modal.install.message.version_error', {
                  message: fetchError.message
                })}
              </p>
            )}
          </ModalDescription>
        )}
        {!isFirstLoading &&
          !fetchError && (
            <ModalFooter className="sto-install-footer">
              {installError && (
                <p className="u-error">
                  {t('app_modal.install.message.install_error', {
                    message: installError.message
                  })}
                </p>
              )}
              <div className="sto-install-controls">
                <button
                  role="button"
                  className="c-btn c-btn--secondary"
                  onClick={onCancel}
                  disabled={isInstalling || isCanceling}
                  aria-busy={isCanceling}
                >
                  <span>{t('app_modal.install.cancel')}</span>
                </button>
                <button
                  role="button"
                  disabled={isInstalling || isCanceling}
                  aria-busy={isInstalling}
                  className="c-btn c-btn--regular c-btn--download"
                  onClick={this.installApp}
                >
                  <span>
                    {hasPendingUpdate(app)
                      ? t('app_modal.install.update')
                      : t('app_modal.install.install')}
                  </span>
                </button>
              </div>
            </ModalFooter>
          )}
      </React.Fragment>
    )
  }
}

AppInstallation.propTypes = {
  appSlug: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  app: getAppBySlug(state, ownProps.appSlug),
  isFetching: state.apps.isFetching,
  isInstalling: state.apps.isInstalling,
  fetchError: state.apps.fetchError
})

const mapDispatchToProps = dispatch => ({
  installApp: (appSlug, appType, channel, isUpdate) =>
    dispatch(installAppFromRegistry(appSlug, appType, channel, isUpdate))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AppInstallation))
