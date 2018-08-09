import React, { Component } from 'react'

import { ModalFooter } from 'cozy-ui/react/Modal'

import { translate } from 'cozy-ui/react/I18n'
import Icon from 'cozy-ui/react/Icon'

import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'

export class InstallModalFooter extends Component {
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
      fetchError,
      installError,
      isFetching,
      isInstalling,
      isCanceling,
      t
    } = this.props

    const isFirstLoading = isFetching && !isCanceling
    return (
      !isFirstLoading &&
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
              disabled={isInstalling || isCanceling}
              aria-busy={isInstalling}
              className="c-btn c-btn--regular c-btn--download"
              onClick={() => this.installApp()}
            >
              <Icon
                icon={cozySmileIcon}
                color="#FFFFFF"
                width="16px"
                height="16px"
                className="sto-app-install-button-icon"
              />
              <span>{t('app_modal.install.install')}</span>
            </button>
          </div>
        </ModalFooter>
      )
    )
  }
}

export default translate()(InstallModalFooter)
