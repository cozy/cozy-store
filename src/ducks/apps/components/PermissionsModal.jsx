import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Portal from 'cozy-ui/transpiled/react/Portal'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/deprecated/Modal'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import PermissionsList from '@/ducks/apps/components/PermissionsList'

export const PermissionsModal = ({ app, parent }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { search } = useLocation()

  const gotoParent = () => {
    if (app && app.slug) {
      navigate(`${parent}/${app.slug}${search}`)
    } else {
      navigate(`${parent}${search}`)
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
