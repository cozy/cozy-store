import React, { Component } from 'react'
import { withRouter } from 'react-router'

import Modal from 'cozy-ui/react/Modal'

import AppInstallation from './AppInstallation'

import { APP_TYPE } from 'ducks/apps'

export class InstallModal extends Component {
  constructor(props) {
    super(props)
    this.gotoParent = this.gotoParent.bind(this)
    if (typeof props.fetchApp === 'function') props.fetchApp()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.app) this.gotoParent()
  }

  gotoParent() {
    const { app, parent, history } = this.props
    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(`${parent}`)
    }
  }

  onSuccess(app) {
    const { history, parent } = this.props

    if (app.type === APP_TYPE.KONNECTOR) {
      history.push(`${parent}/${app.slug}/configure`)
    } else {
      this.gotoParent()
    }
  }

  render() {
    const { app, installApp, isInstalling, channel, isAppFetching } = this.props
    if (!app) return null
    return (
      <div className="sto-modal--install">
        <Modal secondaryAction={this.gotoParent} mobileFullscreen>
          <AppInstallation
            app={app}
            installApp={installApp}
            isFetching={isAppFetching}
            channel={channel}
            isInstalling={isInstalling}
            onCancel={() => this.gotoParent()}
            onSuccess={app => this.onSuccess(app)}
          />
        </Modal>
      </div>
    )
  }
}

export default withRouter(InstallModal)
