import React, { Component } from 'react'

import { connect } from 'react-redux'
import { PropTypes } from 'react-proptypes'

import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'
import getChannel from 'lib/getChannelFromSource'
import { ModalDescription, ModalHeader, ModalFooter } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'

import PermissionsList from './PermissionsList'
import { translate } from 'cozy-ui/react/I18n'
import Alerter from 'cozy-ui/react/Alerter'
import Checkbox from 'cozy-ui/react/Checkbox'
import { hasPendingUpdate } from 'ducks/apps/appStatus'

import { APP_TYPE, getAppBySlug, installAppFromRegistry } from 'ducks/apps'

export class AppInstallation extends Component {
  constructor(props) {
    super(props)
    this.state = { isTermsAccepted: false }
  }

  installApp = async () => {
    if (!this.isInstallReady()) return // Not ready to be installed
    const { app, channel, installApp, onError } = this.props
    try {
      await installApp(app, channel, app.installed)
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

  acceptTerms = () => {
    this.setState(state => ({
      isTermsAccepted: !state.isTermsAccepted
    }))
  }

  isInstallReady = () => {
    const { app, isInstalling, isCanceling } = this.props
    return (
      !(isInstalling || isCanceling) &&
      (!app.terms || this.state.isTermsAccepted)
    )
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
    const { isTermsAccepted } = this.state
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
              {app.terms && (
                <div className="sto-install-terms">
                  <Checkbox
                    className="sto-install-terms-checkbox"
                    onChange={this.acceptTerms}
                    checked={isTermsAccepted}
                    disabled={isInstalling}
                  />
                  <span>
                    <ReactMarkdownWrapper
                      source={t('app_modal.install.terms', {
                        url: app.terms.url
                      })}
                    />
                  </span>
                </div>
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
                  disabled={!this.isInstallReady()}
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
  fetchError: state.apps.fetchError,
  installError: state.apps.actionError
})

const mapDispatchToProps = dispatch => ({
  installApp: (app, channel, isUpdate) =>
    dispatch(installAppFromRegistry(app, channel, isUpdate))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AppInstallation))
