import React, { Component } from 'react'

import { connect } from 'react-redux'
import { PropTypes } from 'react-proptypes'
import flags from 'cozy-flags'

import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'
import { ModalDescription, ModalHeader, ModalFooter } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'
import Button from 'cozy-ui/react/Button'

import PermissionsList from 'ducks/apps/components/PermissionsList'
import Partnership from 'ducks/apps/components/Partnership'
import { translate } from 'cozy-ui/react/I18n'
import Alerter from 'cozy-ui/react/Alerter'
import Checkbox from 'cozy-ui/react/Checkbox'

import { getTranslatedManifestProperty } from 'lib/helpers'
import { hasPendingUpdate } from 'ducks/apps/appStatus'
import CTS from 'config/constants'

import { APP_TYPE, getAppBySlug, installAppFromRegistry } from 'ducks/apps'

const shouldSkipPermissions = app =>
  flags('skip-low-permissions') && app.label <= CTS.default.authorizedLabelLimit

const hasInstallation = app => !app.installed || hasPendingUpdate(app)

export class AppInstallation extends Component {
  constructor(props) {
    super(props)
    const { app } = props
    this.state = { isTermsAccepted: false }
    if (shouldSkipPermissions(app) && hasInstallation(app)) {
      this.installApp()
    }
    this.installApp = this.installApp.bind(this)
  }

  installApp() {
    if (!this.isInstallReady()) return // Not ready to be installed
    const { app, channel, installApp, onInstallOrUpdate, t } = this.props
    const isUpdate = app.installed
    const isChannelSwitch = !!channel
    installApp(app, channel, isUpdate).catch(error => {
      const appName = getTranslatedManifestProperty(app, 'name', t)
      Alerter.error(
        t('app_modal.install.alert.install_error', {
          message: error.message,
          name: appName
        }),
        {
          duration: 12000,
          buttonText: t('app_modal.install.alert.dismiss'),
          buttonAction: dismiss => dismiss()
        }
      )
      console.error(error)
    })
    if (isUpdate || isChannelSwitch || app.type !== APP_TYPE.KONNECTOR) {
      if (typeof onInstallOrUpdate === 'function') onInstallOrUpdate()
    }
  }

  componentDidUpdate = prevProps => {
    const { app, onKonnectorInstall } = this.props
    const justInstalled =
      !!prevProps.app && !prevProps.app.installed && app.installed
    if (justInstalled && app.type === APP_TYPE.KONNECTOR) {
      if (typeof onKonnectorInstall === 'function') onKonnectorInstall()
    }
  }

  acceptTerms = () => {
    this.setState(state => ({
      isTermsAccepted: !state.isTermsAccepted
    }))
  }

  isInstallReady = () => {
    const { app, isInstalling } = this.props
    return !isInstalling && (!app.terms || this.state.isTermsAccepted)
  }

  render() {
    const {
      app,
      fetchError,
      installError,
      isFetching,
      isAppFetching,
      isInstalling,
      onCancel,
      t
    } = this.props
    const { isTermsAccepted } = this.state
    const isFetchingSomething = isFetching || isAppFetching
    const isCurrentAppInstalling = isInstalling === app.slug

    if (shouldSkipPermissions(app) && hasInstallation(app)) {
      return (
        <React.Fragment>
          <ModalDescription className="sto-install-loading-wrapper">
            <div className="sto-install-loading">
              <Spinner size="xxlarge" />
            </div>
          </ModalDescription>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <ModalHeader title={t('app_modal.install.title')} />
        {isFetchingSomething ? (
          <ModalDescription className="sto-install-loading-wrapper">
            <div className="sto-install-loading">
              <Spinner size="xlarge" />
            </div>
          </ModalDescription>
        ) : (
          <ModalDescription>
            {app.partnership && <Partnership app={app} />}
            {app.permissions && <PermissionsList app={app} />}
            {fetchError && (
              <p className="u-error">
                {t('app_modal.install.message.version_error', {
                  message: fetchError.message
                })}
              </p>
            )}
          </ModalDescription>
        )}
        {!isFetchingSomething &&
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
                  >
                    <ReactMarkdownWrapper
                      source={t('app_modal.install.terms', {
                        url: app.terms.url
                      })}
                    />
                  </Checkbox>
                </div>
              )}
              <div className="sto-install-controls">
                <Button
                  theme="secondary"
                  onClick={onCancel}
                  disabled={isCurrentAppInstalling}
                  label={t('app_modal.install.cancel')}
                  extension="full"
                  className="u-mh-half"
                />
                <Button
                  theme="primary"
                  disabled={!this.isInstallReady() || isInstalling}
                  busy={isCurrentAppInstalling}
                  extension="full"
                  onClick={this.installApp}
                  label={
                    hasPendingUpdate(app)
                      ? t('app_modal.install.update')
                      : t('app_modal.install.install')
                  }
                  className="u-mh-half"
                />
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
  isAppFetching: state.apps.isAppFetching,
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
