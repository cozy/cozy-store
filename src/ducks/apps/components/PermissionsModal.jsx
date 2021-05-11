import React, { Component } from 'react'

import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Portal from 'cozy-ui/transpiled/react/Portal'

import { withRouter } from 'react-router-dom'
import PermissionsList from 'ducks/apps/components/PermissionsList'

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
      <Portal into="body">
        <Modal secondaryAction={() => this.gotoParent()} mobileFullscreen>
          <ModalHeader className="sto-install-header">
            <h2>{t('app_modal.permissions.title')}</h2>
          </ModalHeader>
          <ModalContent>
            <PermissionsList app={app} />
          </ModalContent>
        </Modal>
      </Portal>
    )
  }
}

export default withRouter(translate()(PermissionsModal))
