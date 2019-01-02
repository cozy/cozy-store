import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import FocusTrap from 'focus-trap-react'
import PropTypes from 'prop-types'

import AppInstallation from './AppInstallation'
import getChannel from 'lib/getChannelFromSource'

import { fetchLatestApp, getAppBySlug, restoreSavedApp } from 'ducks/apps'

export class ChannelModal extends Component {
  constructor(props) {
    super(props)
    const {
      app,
      channel,
      fetchLatestApp,
      onCurrentChannel,
      onNotHandled
    } = props

    this.state = {
      activeTrap: true
    }

    if (!this.isAppHandled()) {
      onNotHandled()
    } else if (getChannel(app.source) === channel) {
      onCurrentChannel()
    } else {
      fetchLatestApp(app, channel)
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

  dismiss = () => {
    const { dismissAction, restoreSavedApp } = this.props
    // reste the previous app state saved just before the fetch
    restoreSavedApp()
    dismissAction()
  }

  unmountTrap = () => {
    this.setState({ activeTrap: false })
  }

  render() {
    const { app, onSuccess, channel } = this.props
    if (!this.isAppHandled()) return null
    return (
      <div className="sto-modal--install">
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            clickOutsideDeactivates: true
          }}
        >
          <Modal dismissAction={this.dismiss} mobileFullscreen>
            <AppInstallation
              appSlug={app.slug}
              channel={channel}
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
  fetchLatestApp: PropTypes.func.isRequired,
  onCurrentChannel: PropTypes.func.isRequired,
  onNotHandled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLatestApp: (app, channel) =>
    dispatch(fetchLatestApp(ownProps.lang, app.slug, channel, app)),
  restoreSavedApp: () => dispatch(restoreSavedApp())
})

const mapStateToProps = (state, ownProps) => ({
  app: getAppBySlug(state, ownProps.appSlug)
})

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChannelModal)
)
