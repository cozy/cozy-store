import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import AppInstallation from 'ducks/apps/components/AppInstallation'
import { hasPendingUpdate } from 'ducks/apps/appStatus'
import { fetchLatestApp, restoreAppIfSaved } from 'ducks/apps'

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
    const { app, redirectToApp, redirectToConfigure, t } = this.props

    return (
      <Dialog
        open={true}
        onClose={this.dismiss}
        title={t('app_modal.install.title')}
        content={
          <AppInstallation
            appSlug={app.slug}
            onCancel={this.dismiss}
            onKonnectorInstall={redirectToConfigure}
            onInstallOrUpdate={redirectToApp}
          />
        }
      />
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
