import { getAppBySlug } from 'ducks/apps'
import { APP_TYPE } from 'ducks/apps'
import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withClient } from 'cozy-client'
import Intents from 'cozy-interapp'
import IntentModal from 'cozy-ui/transpiled/react/deprecated/IntentModal'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

export class ConfigureModal extends Component {
  constructor(props) {
    super(props)
    const { app, onNotInstalled, onWebApp } = this.props

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

  render() {
    const { app, dismissAction, onSuccess, breakpoints = {} } = this.props
    const { isMobile } = breakpoints
    return (
      <IntentModal
        create={this.intents.create.bind(this.intents)}
        action="CREATE"
        doctype="io.cozy.accounts"
        options={{ slug: app.slug }}
        dismissAction={dismissAction}
        onComplete={onSuccess}
        mobileFullscreen
        overflowHidden
        size="small"
        {...(!isMobile ? { height: '41rem' } : {})}
        into="body"
      />
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
