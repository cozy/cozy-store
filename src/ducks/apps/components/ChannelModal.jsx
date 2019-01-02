import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'cozy-ui/react/Modal'
import FocusTrap from 'focus-trap-react'
import PropTypes from 'prop-types'

import AppInstallation from './AppInstallation'
import getChannel from 'lib/getChannelFromSource'

import { getAppBySlug } from 'ducks/apps'

export class ChannelModal extends Component {
  constructor(props) {
    super(props)
    const { app, channel, fetchApp, onCurrentChannel, onNotHandled } = props

    this.state = {
      previousChannel: getChannel(app.source),
      isCanceling: false,
      activeTrap: true
    }

    if (!this.isAppHandled()) {
      onNotHandled()
    } else if (getChannel(app.source) === channel) {
      onCurrentChannel()
    } else {
      fetchApp(channel)
    }
  }

  isAppHandled = () => {
    const { app } = this.props
    return !!(app.installed && app.isInRegistry && getChannel(app.source))
  }

  componentDidUpdate = () => {
    const { app, channel, onCurrentChannel } = this.props
    if (getChannel(app.source) === channel) {
      onCurrentChannel()
    }
  }

  async dismiss() {
    const { dismissAction, fetchApp } = this.props
    const { previousChannel } = this.state
    // fetch previous channel if channel switch canceled
    this.setState(() => ({ isCanceling: true }))
    await fetchApp(previousChannel)
    this.setState(() => ({ isCanceling: false }))

    dismissAction()
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
    const { isCanceling } = this.state
    if (!this.isAppHandled()) return null
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
              isCanceling={isCanceling}
              onCancel={this.dismiss}
              onSuccess={onSuccess}
            />
          </Modal>
        </FocusTrap>
      </div>
    )
  }
}

ChannelModal.propTypes = {
  app: PropTypes.object.isRequired,
  channel: PropTypes.string.isRequired,
  dismissAction: PropTypes.func.isRequired,
  fetchApp: PropTypes.func.isRequired,
  onCurrentChannel: PropTypes.func.isRequired,
  onNotHandled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  app: getAppBySlug(state, ownProps.appSlug)
})

export default connect(mapStateToProps)(ChannelModal)
