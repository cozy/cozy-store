import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import PermissionsList from './PermissionsList'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

import { getLocalizedAppProperty } from 'ducks/apps'

export class InstallModal extends Component {
  constructor (props) {
    super(props)

    if (props.app) props.fetchLastAppVersion(props.app.slug)

    this.gotoParent = this.gotoParent.bind(this)
    this.installApp = this.installApp.bind(this)
  }

  installApp () {
    this.setState({ error: null })
    const { app } = this.props
    this.props.installApp(app.slug)
    .then(() => {
      this.gotoParent()
    })
    .catch()
  }

  gotoParent () {
    const { app, parent, history } = this.props
    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(`${parent}`)
    }
  }

  render () {
    const { t, lang, app, isVersionFetching, currentAppVersion, versionError, isInstalling, error } = this.props
    // if app not found, return to parent
    if (!app) {
      this.gotoParent()
      return null
    }
    let permissions = null
    if (currentAppVersion && !isVersionFetching && !versionError) {
      permissions = (currentAppVersion.manifest && currentAppVersion.manifest.permissions) || {}
    }
    const appName = getLocalizedAppProperty(app, 'name', lang)
    return (
      <div className='sto-modal--install'>
        <Modal
          secondaryAction={this.gotoParent}
        >
          <ModalContent>
            <header className='sto-modal-header'>
              <div className='sto-modal-header-icon' aria-busy={isVersionFetching}>
                <a href='https://cozy.io' target='_blank' title='Cozy Website' class='sto-modal-header-icon-shield' />
              </div>
              {!isVersionFetching && !versionError &&
                <h2>{t('app_modal.install.title', {appName})}</h2>
              }
            </header>
            <div className='sto-modal-content'>
              {permissions && <PermissionsList permissions={permissions} appName={appName} />
              }
              {!isVersionFetching && !versionError &&
                <div>
                  {permissions && !!Object.values(permissions).length &&
                    <ReactMarkdownWrapper
                      source={t('app_modal.install.accept_description', {
                        appName
                      })
                      }
                    />
                  }
                  {error &&
                    <p class='coz-error'>{t('app_modal.install.message.install_error', {message: error.message})}</p>
                  }
                  <div className='sto-modal-controls'>
                    <button
                      role='button'
                      className='coz-btn coz-btn--secondary'
                      onClick={this.gotoParent}
                    >
                      {t('app_modal.install.cancel')}
                    </button>
                    <button
                      role='button'
                      disabled={isInstalling}
                      aria-busy={isInstalling}
                      className='coz-btn coz-btn--regular coz-btn--download'
                      onClick={this.installApp}
                    >
                      {t('app_modal.install.install')}
                    </button>
                  </div>
                </div>
              }
              {versionError &&
                <p class='coz-error'>{t('app_modal.install.message.version_error', {message: versionError.message})}</p>
              }
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(withRouter(InstallModal))
