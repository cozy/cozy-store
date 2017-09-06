/* global cozy */

import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

class ApplicationModal extends Component {
  uninstallApp (appSlug) {
    this.props.uninstallApp(appSlug)
    .then(() => {
      this.gotoParent()
    })
  }

  gotoParent () {
    this.props.history.push(`/myapps`)
  }

  render () {
    const { t } = this.props
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
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(ApplicationModal)
