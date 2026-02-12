import React, { PureComponent } from 'react'
import { translate } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/deprecated/Modal'
import AppIcon from 'cozy-ui-plus/dist/AppIcon'

import { getAppIconProps } from '@/ducks/apps'

export class InstallSuccess extends PureComponent {
  render() {
    const { t, app, onTerminate } = this.props
    return (
      <React.Fragment>
        <ModalHeader className="sto-install-success-header">
          <AppIcon app={app} className="sto-app-icon" {...getAppIconProps()} />
        </ModalHeader>
        <ModalContent className="sto-install-success-content">
          <p>{t('intent.install.success', { appName: app.name })}</p>
          <Button label={t('intent.install.terminate')} onClick={onTerminate} />
        </ModalContent>
      </React.Fragment>
    )
  }
}

export default translate()(InstallSuccess)
