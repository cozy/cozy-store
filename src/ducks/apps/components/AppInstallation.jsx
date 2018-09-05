import React, { Component } from 'react'

import { ModalContent, ModalHeader, ModalFooter } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'

import PermissionsList from './PermissionsList'
import { translate } from 'cozy-ui/react/I18n'
import { hasPendingUpdate } from 'ducks/apps/appStatus'

class AppInstallation extends Component {
  installApp = () => {
    this.setState({ error: null })
    const { app, onError, channel } = this.props
    this.props.installApp(app.slug, app.type, channel).catch(error => {
      if (onError) return onError(error)
      throw error
    })
  }

  updateApp = () => {
    this.setState({ error: null })
    const { app, onError, channel } = this.props
    this.props.updateApp(app.slug, app.type, channel, true).catch(error => {
      if (onError) return onError(error)
      throw error
    })
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
      <div className="sto-install">
        <ModalHeader className="sto-install-header">
          <h2>{t('app_modal.install.title')}</h2>
        </ModalHeader>
        <div className="sto-install-content">
          <div className="sto-install-top">
            {isFirstLoading ? (
              <ModalContent>
                <div className="sto-install-loading">
                  <Spinner size="xlarge" />
                </div>
              </ModalContent>
            ) : (
              <ModalContent>
                {permissions && <PermissionsList app={app} appName={appName} />}
                {fetchError && (
                  <p className="u-error">
                    {t('app_modal.install.message.version_error', {
                      message: fetchError.message
                    })}
                  </p>
                )}
              </ModalContent>
            )}
          </div>
          <div className="sto-install-bottom">
            {!isFirstLoading &&
              !fetchError && (
                <ModalFooter>
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
                      onClick={
                        hasPendingUpdate(app) ? this.updateApp : this.installApp
                      }
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
          </div>
        </div>
      </div>
    )
  }
}

export default translate()(AppInstallation)
