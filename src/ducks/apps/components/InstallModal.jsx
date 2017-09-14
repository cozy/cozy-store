import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import PermissionsList from './PermissionsList'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

export class InstallModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null
    }

    if (props.app) props.fetchLastAppVersion(props.app.slug)

    this.gotoParent = this.gotoParent.bind(this)
    this.installApp = this.installApp.bind(this)
    this.getPermissions = this.getPermissions.bind(this)
  }

  installApp () {
    this.setState({ error: null })
    const { app } = this.props
    this.props.installApp(app.slug)
    .then(() => {
      this.gotoParent()
    })
    .catch(error => {
      this.setState({ error })
    })
  }

  gotoParent () {
    const { parent } = this.props
    this.context.router.history.push(parent)
  }

  getPermissions () {
    const { currentAppVersion, t } = this.props
    const manifest = currentAppVersion && currentAppVersion.manifest
    const permissionsArray = Object.values(manifest.permissions) || []
    return permissionsArray.map(p => {
      p.typeDescription = (t(`doctypes.${p.type}`)).replace(/^doctypes\./, '')
      return p
    })
  }

  render () {
    const { t, app, isVersionFetching, currentAppVersion, versionError, isInstalling } = this.props
    const { error } = this.state
    // if app not found, return to parent
    if (!app) {
      this.gotoParent()
      return null
    }
    let permissions = null
    if (currentAppVersion && !isVersionFetching && !versionError) permissions = this.getPermissions()
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
              <h2>{t('app_modal.install.title', {appName: app.name})}</h2>
            </header>
            <div className='sto-modal-content'>
              {permissions && <PermissionsList permissions={permissions} appName={app.name} />
              }
              {!isVersionFetching && !versionError &&
                <div>
                  {permissions && !!permissions.length &&
                    <ReactMarkdownWrapper
                      source={t('app_modal.install.accept_description', {
                        appName: app.name
                      })
                      }
                    />
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
              {error &&
                <p class='coz-error'>{t('app_modal.install.message.install_error', {message: error.message})}</p>
              }
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(InstallModal)
