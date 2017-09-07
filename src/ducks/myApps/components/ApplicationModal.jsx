/* global cozy */

import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

class ApplicationModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null
    }
  }

  uninstallApp (appSlug) {
    this.setState({ error: null })
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
    const { t } = this.props
    const { error } = this.state
    // params from route
    const { appSlug } = this.props.match && this.props.match.params
    return (
      <div className='sto-myapps-modal--uninstall'>
        <Modal
          title={t('app_modal.uninstall.title')}
          primaryAction={() => this.uninstallApp(appSlug)}
          primaryText={t('app_modal.uninstall.uninstall')}
          primaryType='danger'
          secondaryAction={() => this.gotoParent()}
          secondaryText={t('app_modal.uninstall.cancel')}
          secondaryType='secondary'
        >
          <ModalContent>
            <div className='sto-myapps-modal-content'>
              <ReactMarkdownWrapper
                source={t('app_modal.uninstall.description', {
                  cozyName: cozy.client._url.replace(/^\/\//, '')
                })}
              />
              {error &&
                <p class='coz-error'>{t('app_modal.uninstall.message.error', {message: error.message})}</p>
              }
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(ApplicationModal)
