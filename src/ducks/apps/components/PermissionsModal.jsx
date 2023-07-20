import React from 'react'
import { useNavigate } from 'react-router-dom'

import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Portal from 'cozy-ui/transpiled/react/Portal'

import PermissionsList from 'ducks/apps/components/PermissionsList'

export const PermissionsModal = ({ app, parent }) => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const gotoParent = () => {
    if (app && app.slug) {
      navigate(`${parent}/${app.slug}`)
    } else {
      navigate(`${parent}`)
    }
  }

  return (
    <Portal into="body">
      <Modal secondaryAction={() => gotoParent()} mobileFullscreen>
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

export default PermissionsModal
