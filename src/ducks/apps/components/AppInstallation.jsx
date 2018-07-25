import React, { Component } from 'react'

import { ModalContent, ModalFooter } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'

import PermissionsList from './PermissionsList'
import { translate } from 'cozy-ui/react/I18n'
import AnimatedModalHeader from 'ducks/components/AnimatedModalHeader'

class AppInstallation extends Component {
  installApp() {
    this.setState({ error: null })
    const { app, onError, channel } = this.props
    this.props.installApp(app.slug, app.type, channel).catch(error => {
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
    // this part must not be wrapped in a component
    // so we get the content using it as a function
    const animatedHeader = AnimatedModalHeader({
      app
    })

    return (
      <div>
        {isFirstLoading ? (
          <ModalContent>
            <div className="sto-install-loading">
              <Spinner size="xlarge" />
            </div>
          </ModalContent>
        ) : (
          <ModalContent>
            {animatedHeader}
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
