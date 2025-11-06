import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withClient } from 'cozy-client'
import Intents from 'cozy-interapp'
import { DialogCloseButton } from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import IntentIframe from 'cozy-ui-plus/dist/Intent/IntentIframe'

import { APP_TYPE } from '@/ducks/apps'
import { getAppBySlug } from '@/ducks/apps'

export class ConfigureModal extends Component {
  constructor(props) {
    super(props)
    const { app, onNotInstalled, onWebApp } = this.props
    this.state = { modalOpened: true }

    if (!app.installed) {
      onNotInstalled()
    }

    if (app.type === APP_TYPE.WEBAPP) {
      onWebApp()
    }
  }

  UNSAFE_componentWillMount() {
    const { client } = this.props
    this.intents = new Intents({ client })
  }

  onClose = () => {
    this.setState({
      modalOpened: false
    })
  }

  render() {
    const { app, dismissAction, onSuccess, breakpoints = {} } = this.props
    const { modalOpened } = this.state
    const { isMobile } = breakpoints

    return (
      <Dialog
        open={modalOpened}
        classes={{ paper: 'u-h-100' }}
        fullScreen={isMobile}
        fullWidth
        maxWidth="md"
        onClose={this.onClose}
      >
        <DialogCloseButton onClick={this.onClose} />
        <IntentIframe
          create={this.intents.create.bind(this.intents)}
          action="CREATE"
          doctype="io.cozy.accounts"
          options={{ slug: app.slug }}
          onCancel={dismissAction}
          onTerminate={onSuccess}
        />
      </Dialog>
    )
  }
}

ConfigureModal.propTypes = {
  app: PropTypes.object.isRequired,
  dismissAction: PropTypes.func.isRequired,
  onNotInstalled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onWebApp: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  app: getAppBySlug(state, ownProps.appSlug)
})

export default compose(
  connect(mapStateToProps),
  withBreakpoints(),
  withClient
)(ConfigureModal)
