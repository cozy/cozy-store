import { fetchLatestApp, restoreAppIfSaved } from 'ducks/apps'
import { hasPendingUpdate } from 'ducks/apps/appStatus'
import AppInstallation from 'ducks/apps/components/AppInstallation'
import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Portal from 'cozy-ui/transpiled/react/Portal'
import Modal from 'cozy-ui/transpiled/react/deprecated/Modal'

export class InstallModal extends Component {
  constructor(props) {
    super(props)
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

  dismiss = () => {
    this.props.restoreAppIfSaved()
    this.props.dismissAction()
  }

  render() {
    const { app, redirectToApp, redirectToConfigure } = this.props

    return (
      <Portal into="body">
        <Modal dismissAction={this.dismiss} mobileFullscreen>
          <AppInstallation
            appSlug={app.slug}
            onCancel={this.dismiss}
            onKonnectorInstall={redirectToConfigure}
            onInstallOrUpdate={redirectToApp}
          />
        </Modal>
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
