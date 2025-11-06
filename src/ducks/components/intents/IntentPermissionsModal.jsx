import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Left from 'cozy-ui/transpiled/react/Icons/Left'
import IntentHeader from 'cozy-ui/transpiled/react/IntentHeader'
import Portal from 'cozy-ui/transpiled/react/Portal'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Modal, { ModalContent } from 'cozy-ui/transpiled/react/deprecated/Modal'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import PermissionsList from '@/ducks/apps/components/PermissionsList'

export const IntentPermissionsModal = ({ app, parent, intentData }) => {
  const { appData } = intentData || {}
  const { t } = useI18n()
  const navigate = useNavigate()
  const { search } = useLocation()

  return (
    <Portal into="body">
      <Modal mobileFullscreen closable={false}>
        <IntentHeader
          appEditor={appData.app.editor}
          appName={appData.app.name}
          appIcon={`../${appData.app.icon}`}
        />
        <ModalContent>
          <Button
            startIcon={<Icon icon={Left} />}
            className="sto-app-back"
            label={t('app_modal.permissions.back')}
            onClick={() => navigate(`${parent}/${app.slug}${search}`)}
            variant="text"
          />
          <Typography variant="h5" className="u-ta-center">
            {t('app_modal.permissions.title')}
          </Typography>
          <PermissionsList app={app} />
        </ModalContent>
      </Modal>
    </Portal>
  )
}

export default IntentPermissionsModal
