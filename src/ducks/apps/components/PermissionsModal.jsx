import React, { Component } from 'react'

import Modal, { ModalContent, ModalHeader } from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'

import { withRouter } from 'react-router-dom'
import PermissionsList from './PermissionsList'

export class PermissionsModal extends Component {
  gotoParent() {
    const { app, parent, history } = this.props
    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(`${parent}`)
    }
  }

  render() {
    const { t, app } = this.props
    return (
      <Modal secondaryAction={() => this.gotoParent()} mobileFullscreen>
        <ModalHeader className="sto-install-header">
          <h2>{t('app_modal.permissions.title')}</h2>
        </ModalHeader>
        <ModalContent>
          <PermissionsList app={app} />
        </ModalContent>
      </Modal>
    )
  }
}

export default withRouter(translate()(PermissionsModal))
