import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/react/Modal'
import FocusTrap from 'focus-trap-react'
import { translate } from 'cozy-ui/react/I18n'
import Portal from 'cozy-ui/react/Portal'
import { withClient } from 'cozy-client'
import compose from 'lodash/flowRight'
import AppInstallation from 'ducks/apps/components/AppInstallation'
import { hasPendingUpdate } from 'ducks/apps/appStatus'
import { fetchLatestApp, restoreAppIfSaved } from 'ducks/apps'

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

  dismiss = () => {
    this.props.restoreAppIfSaved()
    this.props.dismissAction()
  }

  render() {
    const { app, redirectToApp, redirectToConfigure } = this.props
    return (
      <Portal into="body">
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            clickOutsideDeactivates: true
          }}
        >
          <Modal dismissAction={this.dismiss} mobileFullscreen>
            <AppInstallation
              appSlug={app.slug}
              onCancel={this.dismiss}
              onKonnectorInstall={redirectToConfigure}
              onInstallOrUpdate={redirectToApp}
            />
          </Modal>
        </FocusTrap>
      </Portal>
    )
  }
}

InstallModal.propTypes = {
  app: PropTypes.object.isRequired,
  dismissAction: PropTypes.func.isRequired,
  onInstalled: PropTypes.func.isRequired,
  redirectToConfigure: PropTypes.func.isRequired,
  redirectToApp: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLatestApp: app =>
    dispatch(
      fetchLatestApp(ownProps.client, ownProps.lang, app.slug, undefined, app)
    ),
  restoreAppIfSaved: () => dispatch(restoreAppIfSaved())
})

export default compose(
  withClient,
  translate(),
  connect(
    null,
    mapDispatchToProps
  )
)(InstallModal)
