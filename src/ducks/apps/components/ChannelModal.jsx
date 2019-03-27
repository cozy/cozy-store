import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import FocusTrap from 'focus-trap-react'
import Portal from 'cozy-ui/react/Portal'
import PropTypes from 'prop-types'

import AppInstallation from 'ducks/apps/components/AppInstallation'
import getChannel from 'lib/getChannelFromSource'

import { fetchLatestApp, getAppBySlug, restoreAppIfSaved } from 'ducks/apps'

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
    this.props.restoreAppIfSaved()
    this.props.dismissAction()
  }

  unmountTrap = () => {
    this.setState({ activeTrap: false })
  }

  render() {
    const { app, onSuccess, channel } = this.props
    if (!this.isAppHandled()) return null
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
              channel={channel}
              onCancel={this.dismiss}
              onInstallOrUpdate={onSuccess}
            />
          </Modal>
        </FocusTrap>
      </Portal>
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
  restoreAppIfSaved: () => dispatch(restoreAppIfSaved())
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
