import React, { Component } from 'react'

import PermissionsList from './PermissionsList'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

import { getLocalizedAppProperty } from 'ducks/apps'
import { translate } from 'cozy-ui/react/I18n'

class AppInstallation extends Component {
  installApp () {
    this.setState({ error: null })
    const { app, onError, onSuccess } = this.props
    this.props
      .installApp(app.slug, app.type)
      .then(() => {
        onSuccess(app)
      })
      .catch(error => {
        if (onError) return onError(error)
        throw error
      })
  }

  render () {
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
      <div>
        <header className='sto-install-header'>
          <div className='sto-install-header-icon' aria-busy={isFetching}>
            <span className='sto-install-header-icon-shield' />
          </div>
          {!isFetching &&
            !fetchError && (
              <h2>{t('app_modal.install.title', { appName })}</h2>
            )}
        </header>
        <div className='sto-install-content'>
          {permissions && (
            <PermissionsList permissions={app.permissions} appName={appName} />
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
                {installError && (
                  <p className='u-error'>
                    {t('app_modal.install.message.install_error', {
                      message: installError.message
                    })}
                  </p>
                )}
                <div className='sto-install-controls'>
                  <button
                    role='button'
                    className='c-btn c-btn--secondary'
                    onClick={onCancel}
                  >
                    <span>{t('app_modal.install.cancel')}</span>
                  </button>
                  <button
                    role='button'
                    disabled={isInstalling}
                    aria-busy={isInstalling}
                    className='c-btn c-btn--regular c-btn--download'
                    onClick={() => this.installApp()}
                  >
                    <span>{t('app_modal.install.install')}</span>
                  </button>
                </div>
              </div>
            )}
          {fetchError && (
            <p className='u-error'>
              {t('app_modal.install.message.version_error', {
                message: fetchError.message
              })}
            </p>
          )}
        </div>
      </div>
    )
  }
}

export default translate()(AppInstallation)
