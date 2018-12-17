import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/react/Modal'
import FocusTrap from 'focus-trap-react'

import AppInstallation from './AppInstallation'
import { hasPendingUpdate } from 'ducks/apps/appStatus'

export class InstallModal extends Component {
  constructor(props) {
    super(props)
    const { app, onAlreadyInstalled } = this.props

    this.state = { activeTrap: true }

    if (app.installed && !hasPendingUpdate(app)) {
      onAlreadyInstalled()
    }
  }

  mountTrap = () => {
    this.setState({ activeTrap: true })
  }

  unmountTrap = () => {
    this.setState({ activeTrap: false })
  }

  render() {
    const {
      app,
      dismissAction,
      isInstalling,
      onSuccess,
      channel,
      isAppFetching
    } = this.props
    if (!app) return null
    return (
      <div className="sto-modal--install">
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            clickOutsideDeactivates: true
          }}
        >
          <Modal dismissAction={dismissAction} mobileFullscreen>
            <AppInstallation
              appSlug={app.slug}
              isFetching={isAppFetching}
              channel={channel}
              isInstalling={isInstalling}
              onCancel={dismissAction}
              onSuccess={onSuccess}
            />
          </Modal>
        </FocusTrap>
      </div>
    )
  }
}

InstallModal.propTypes = {
  app: PropTypes.object.isRequired,
  dismissAction: PropTypes.func.isRequired,
  onAlreadyInstalled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

export default InstallModal
