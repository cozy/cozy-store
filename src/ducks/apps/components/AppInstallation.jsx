import React, { useEffect, useState } from 'react'
import compose from 'lodash/flowRight'
import get from 'lodash/get'
import pickBy from 'lodash/pickBy'
import { connect } from 'react-redux'
import { PropTypes } from 'react-proptypes'

import { withClient } from 'cozy-client'
import flags from 'cozy-flags'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Button from 'cozy-ui/transpiled/react/Button'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import storeConfig from 'config'
import { getTranslatedManifestProperty } from 'lib/helpers'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'
import PermissionsList from 'ducks/apps/components/PermissionsList'
import Partnership from 'ducks/apps/components/Partnership'
import { hasPendingUpdate } from 'ducks/apps/appStatus'

import { APP_TYPE, getAppBySlug, installAppFromRegistry } from 'ducks/apps'

const shouldSkipPermissions = app =>
  flags('skip-low-permissions') &&
  app.label <= storeConfig.default.authorizedLabelLimit

const hasInstallation = app => !app.installed || hasPendingUpdate(app)

const AppInstallation = ({
  app,
  channel,
  installAppProp,
  isInstalling,
  isFetching,
  fetchError,
  installError,
  isAppFetching,
  onCancel,
  onInstallOrUpdate,
  onKonnectorInstall
}) => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const didMountRef = React.useRef(false)

  const { t } = useI18n()

  const installApp = async () => {
    if (!isInstallReady()) return // Not ready to be installed
    const isUpdate = app.installed
    const isChannelSwitch = !!channel
    try {
      await installAppProp(app, channel, isUpdate)
    } catch (error) {
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
    }

    if (isUpdate || isChannelSwitch || app.type !== APP_TYPE.KONNECTOR) {
      if (typeof onInstallOrUpdate === 'function') onInstallOrUpdate()
    }
  }

  const isInstallReady = () => {
    const isCurrentAppInstalling = isInstalling === app.slug
    const isTermsReady =
      shouldSkipPermissions(app) || (!app.terms || isTermsAccepted)
    return !isCurrentAppInstalling && isTermsReady
  }

  useEffect(() => {
    const justInstalled = !didMountRef.current && app?.installed
    if (justInstalled) {
      if (app.type === APP_TYPE.KONNECTOR) {
        if (typeof onKonnectorInstall === 'function') onKonnectorInstall()
      }
      didMountRef.current = true
    }
  }, [app, onKonnectorInstall])

  const termsCheckboxTranslationOpts = pickBy(
    {
      url: get(app, 'terms.url'),
      partnerName: get(app, 'partnership.name')
    },
    Boolean
  )

  if (shouldSkipPermissions(app) && hasInstallation(app)) {
    return (
      <div className="u-flex u-flex-justify-center u-flex-items-center u-h-100">
        <Spinner size="xxlarge" />
      </div>
    )
  }

  const isFetchingSomething = isFetching || isAppFetching
  const isCurrentAppInstalling = isInstalling === app.slug

  return (
    <React.Fragment>
      {isFetchingSomething ? (
        <Spinner size="xlarge" />
      ) : (
        <div className="u-ov-auto">
          {app.partnership && <Partnership app={app} />}
          {app.permissions && <PermissionsList app={app} />}
          {fetchError && (
            <p className="u-error">
              {t('app_modal.install.message.version_error', {
                message: fetchError.message
              })}
            </p>
          )}
        </div>
      )}
      {!isFetchingSomething && !fetchError && (
        <div className="sto-install-footer">
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
                onChange={() => setIsTermsAccepted(!isTermsAccepted)}
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
              theme="secondary"
              onClick={onCancel}
              disabled={isCurrentAppInstalling}
              label={t('app_modal.install.cancel')}
              extension="full"
              className="u-mh-half"
            />
            <Button
              theme="primary"
              disabled={!isInstallReady() || isInstalling}
              busy={isCurrentAppInstalling}
              extension="full"
              onClick={installApp}
              label={
                hasPendingUpdate(app)
                  ? t('app_modal.install.update')
                  : t('app_modal.install.install')
              }
              className="u-mh-half"
            />
          </div>
        </div>
      )}
    </React.Fragment>
  )
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
  installAppProp: (app, channel, isUpdate) =>
    dispatch(installAppFromRegistry(ownProps.client, app, channel, isUpdate))
})

export default compose(
  withClient,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AppInstallation)
