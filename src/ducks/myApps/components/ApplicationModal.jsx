/* global cozy */

import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

export class ApplicationModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null
    }

    this.gotoParent = this.gotoParent.bind(this)
    this.uninstallApp = this.uninstallApp.bind(this)
  }

  uninstallApp () {
    this.setState({ error: null })
    const { appSlug } = this.props.match && this.props.match.params
    this.props.uninstallApp(appSlug)
    .then(() => {
      this.gotoParent()
    })
    .catch(error => {
      this.setState({ error })
    })
  }

  gotoParent () {
    this.props.history.push(`/myapps`)
  }

  render () {
    const { t, myApps } = this.props
    const { error } = this.state
    // params from route
    const { appSlug } = this.props.match && this.props.match.params
    const appInfos = myApps.find(a => a.slug === appSlug)
    // if app not found, return to parent
    if (!appInfos) {
      this.gotoParent()
      return null
    }
    return (
      <div className='sto-myapps-modal--uninstall'>
        <Modal
          title={t('app_modal.uninstall.title')}
          secondaryAction={this.gotoParent}
        >
          <ModalContent>
            <div className='sto-myapps-modal-content'>
              <ReactMarkdownWrapper
                source={
                  appInfos.uninstallable
                    ? t('app_modal.uninstall.description', { cozyName: cozy.client._url.replace(/^\/\//, '') })
                    : t('app_modal.uninstall.uninstallable_description')
                }
              />
              {error &&
                <p class='coz-error'>{t('app_modal.uninstall.message.error', {message: error.message})}</p>
              }
              <div className='sto-myapps-modal-controls'>
                <button
                  role='button'
                  className='coz-btn coz-btn--secondary'
                  onClick={this.gotoParent}
                >
                  {t('app_modal.uninstall.cancel')}
                </button>
                <button
                  role='button'
                  disabled={!appInfos.uninstallable}
                  className='coz-btn coz-btn--danger coz-btn--delete'
                  onClick={this.uninstallApp}
                >
                  {t('app_modal.uninstall.uninstall')}
                </button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(ApplicationModal)
