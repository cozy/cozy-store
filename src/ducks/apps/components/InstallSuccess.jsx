import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

import { getAppIconProps } from 'ducks/apps'

export const InstallSuccess = ({ app, onTerminate }) => {
  const { t } = useI18n()

  return (
    <>
      <div className="sto-install-success-header">
        <AppIcon app={app} className="sto-app-icon" {...getAppIconProps()} />
      </div>
      <div className="sto-install-success-content">
        <p>{t('intent.install.success', { appName: app.name })}</p>
        <Button label={t('intent.install.terminate')} onClick={onTerminate} />
      </div>
    </>
  )
}

InstallSuccess.propTypes = {
  app: PropTypes.object.isRequired,
  onTerminate: PropTypes.func.isRequired
}

export default InstallSuccess
