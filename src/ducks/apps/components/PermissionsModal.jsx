import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'

import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Portal from 'cozy-ui/transpiled/react/Portal'

import PermissionsList from 'ducks/apps/components/PermissionsList'

export class PermissionsModal extends Component {
  gotoParent() {
    const { app, parent, navigate } = this.props
    if (app && app.slug) {
      navigate(`${parent}/${app.slug}`)
    } else {
      navigate(`${parent}`)
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

const PermissionsModalWrapper = props => {
  const navigate = useNavigate()
  return <PermissionsModal {...props} navigate={navigate} />
}

export default translate()(PermissionsModalWrapper)
