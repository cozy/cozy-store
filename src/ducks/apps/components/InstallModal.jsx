import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/react/Modal'
import FocusTrap from 'focus-trap-react'
import { translate } from 'cozy-ui/react/I18n'

import AppInstallation from './AppInstallation'
import { hasPendingUpdate } from 'ducks/apps/appStatus'
import { fetchLatestApp } from 'ducks/apps'

export class InstallModal extends Component {
  constructor(props) {
    super(props)
    this.state = { activeTrap: true }
  }

  componentDidMount = () => {
    const { app, fetchLatestApp } = this.props
    this.handleInstalledStatus()
    if (hasPendingUpdate(app)) {
      fetchLatestApp(app)
    }
  }

  handleInstalledStatus = () => {
    const { app, onInstalled } = this.props
    if (app.installed && !hasPendingUpdate(app)) {
      onInstalled()
    }
  }

  unmountTrap = () => {
    this.setState({ activeTrap: false })
  }

  render() {
    const { app, dismissAction, onSuccess, channel } = this.props
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
              channel={channel}
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
  onInstalled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLatestApp: app =>
    dispatch(fetchLatestApp(ownProps.lang, app.slug, undefined, app))
})

export default translate()(
  connect(
    null,
    mapDispatchToProps
  )(InstallModal)
)
