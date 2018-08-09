import React, { Component } from 'react'
import { withRouter } from 'react-router'

import Modal from 'cozy-ui/react/Modal'

import getChannel from 'lib/getChannelFromSource'

import InstallModalContent from './InstallModalContent'
import InstallModalFooter from './InstallModalFooter'

export class Install extends Component {
  constructor(props) {
    super(props)
    this.gotoParent = this.gotoParent.bind(this)
    this.state = {
      previousChannel: props.channel ? getChannel(props.app.source) : null,
      isCanceling: false
    }
    if (typeof props.fetchApp === 'function') props.fetchApp(props.channel)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.app) this.gotoParent()
  }

  async gotoParent() {
    const { app, parent, history, fetchApp } = this.props
    const { previousChannel } = this.state
    // fetch previous channel if channel switch canceled
    if (previousChannel && typeof fetchApp === 'function') {
      this.setState(() => ({ isCanceling: true }))
      await fetchApp(previousChannel)
      this.setState(() => ({ isCanceling: false }))
    }

    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(parent)
    }
  }

  render() {
    const { app, installApp, isInstalling, channel, isAppFetching } = this.props
    const { isCanceling } = this.state
    if (!app) return null
    return (
      <div className="sto-modal--install">
        <Modal dismissAction={this.gotoParent} mobileFullscreen>
          <InstallModalContent
            app={app}
            isFetching={isAppFetching}
            isCanceling={isCanceling}
          />
          <InstallModalFooter
            app={app}
            installApp={installApp}
            isFetching={isAppFetching}
            channel={channel}
            isInstalling={isInstalling}
            isCanceling={isCanceling}
          />
        </Modal>
      </div>
    )
  }
}

export default withRouter(Install)
