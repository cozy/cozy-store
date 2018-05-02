import React, { Component } from 'react'

import { ModalContent, ModalHeader, ModalFooter } from 'cozy-ui/react/Modal'

import PermissionsList from './PermissionsList'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

import { getLocalizedAppProperty } from 'ducks/apps'
import { translate } from 'cozy-ui/react/I18n'

class AppInstallation extends Component {
  installApp() {
    this.setState({ error: null })
    const { app, onError, onSuccess, channel } = this.props
    this.props
      .installApp(app.slug, app.type, channel)
      .then(() => {
        onSuccess(app)
      })
      .catch(error => {
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
      lang,
      onCancel,
      t
    } = this.props

    const appName = getLocalizedAppProperty(app, 'name', lang)
    const permissions = app.permissions || {}

    return (
      <div className="sto-install">
        <ModalHeader className="sto-install-header">
          <div className="sto-install-header-icon" aria-busy={isFetching}>
            <span className="sto-install-header-icon-shield" />
          </div>
        </ModalHeader>
        <ModalContent>
          <div className="sto-install-content">
            {!isFetching &&
              !fetchError && (
                <h3>{t('app_modal.install.title', { appName })}</h3>
              )}
            {permissions && (
              <PermissionsList
                permissions={app.permissions}
                appName={appName}
              />
            )}
            {!isFetching &&
              !fetchError && (
                <div>
                  {permissions &&
                    !!Object.values(permissions).length && (
                      <ReactMarkdownWrapper
                        source={t('app_modal.install.accept_description', {
                          appName
                        })}
                      />
                    )}
                </div>
              )}
            {fetchError && (
              <p className="u-error">
                {t('app_modal.install.message.version_error', {
                  message: fetchError.message
                })}
              </p>
            )}
          </div>
        </ModalContent>
        {!isFetching &&
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
                >
                  <span>{t('app_modal.install.cancel')}</span>
                </button>
                <button
                  role="button"
                  disabled={isInstalling}
                  aria-busy={isInstalling}
                  className="c-btn c-btn--regular c-btn--download"
                  onClick={() => this.installApp()}
                >
                  <span>{t('app_modal.install.install')}</span>
                </button>
              </div>
            </ModalFooter>
          )}
      </div>
    )
  }
}

export default translate()(AppInstallation)
