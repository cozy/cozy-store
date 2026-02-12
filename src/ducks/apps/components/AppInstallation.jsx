import FocusTrap from 'focus-trap-react'
import compose from 'lodash/flowRight'
import get from 'lodash/get'
import pickBy from 'lodash/pickBy'
import React, { Component } from 'react'
import { PropTypes } from 'react-proptypes'
import { connect } from 'react-redux'
import { translate } from 'twake-i18n'

import { withClient } from 'cozy-client'
import flags from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import {
  ModalDescription,
  ModalHeader,
  ModalFooter
} from 'cozy-ui/transpiled/react/deprecated/Modal'

import storeConfig from '@/config/index.json'
import { APP_TYPE, getAppBySlug, installAppFromRegistry } from '@/ducks/apps'
import { hasPendingUpdate, isUnderMaintenance } from '@/ducks/apps/appStatus'
import Partnership from '@/ducks/apps/components/Partnership'
import PermissionsList from '@/ducks/apps/components/PermissionsList'
import ReactMarkdownWrapper from '@/ducks/components/ReactMarkdownWrapper'
import { getTranslatedManifestProperty } from '@/lib/helpers'

const shouldSkipPermissions = app =>
  flags('skip-low-permissions') &&
  app.label <= storeConfig.default.authorizedLabelLimit

const hasInstallation = app => !app.installed || hasPendingUpdate(app)

export class AppInstallation extends Component {
  constructor(props) {
    super(props)
    const { app } = props
    this.state = { isTermsAccepted: false }
    this.installApp = this.installApp.bind(this)
    if (shouldSkipPermissions(app) && hasInstallation(app)) {
      this.installApp()
    }
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

      // eslint-disable-next-line no-console
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
    const isCurrentAppInstalling = isInstalling === app.slug
    const isTermsReady =
      shouldSkipPermissions(app) || !app.terms || this.state.isTermsAccepted
    const underMaintenance = isUnderMaintenance(app)

    return !isCurrentAppInstalling && isTermsReady && !underMaintenance
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

    const termsCheckboxTranslationOpts = pickBy(
      {
        url: get(app, 'terms.url'),
        partnerName: get(app, 'partnership.name')
      },
      Boolean
    )

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
        {!isFetchingSomething && !fetchError && (
          <ModalFooter className="sto-install-footer">
            <FocusTrap
              focusTrapOptions={{
                clickOutsideDeactivates: true
              }}
            >
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
                      className="u-ml-half u-mt-half"
                      source={
                        app.partnership
                          ? t(
                              'app_modal.install.termsWithPartnership',
                              termsCheckboxTranslationOpts
                            )
                          : t(
                              'app_modal.install.terms',
                              termsCheckboxTranslationOpts
                            )
                      }
                    />
                  </Checkbox>
                </div>
              )}
              <div className="sto-install-controls">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isCurrentAppInstalling}
                  label={t('app_modal.install.cancel')}
                  fullWidth
                  className="u-mh-half"
                />
                <Button
                  disabled={!this.isInstallReady() || isInstalling}
                  busy={isCurrentAppInstalling}
                  fullWidth
                  onClick={this.installApp}
                  label={
                    hasPendingUpdate(app)
                      ? t('app_modal.install.update')
                      : t('app_modal.install.install')
                  }
                  className="u-mh-half"
                />
              </div>
            </FocusTrap>
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  installApp: (app, channel, isUpdate) =>
    dispatch(installAppFromRegistry(ownProps.client, app, channel, isUpdate))
})

export default compose(
  withClient,
  connect(mapStateToProps, mapDispatchToProps),
  translate()
)(AppInstallation)
