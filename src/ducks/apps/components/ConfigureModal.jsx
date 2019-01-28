import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import IntentModal from 'cozy-ui/react/IntentModal'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import { getAppBySlug } from 'ducks/apps'

import { APP_TYPE } from 'ducks/apps'

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

  render() {
    const { app, dismissAction, onSuccess, breakpoints = {} } = this.props
    const { isMobile } = breakpoints
    return (
      <IntentModal
        action="CREATE"
        doctype="io.cozy.accounts"
        options={{ slug: app.slug }}
        dismissAction={dismissAction}
        onComplete={onSuccess}
        mobileFullscreen
        overflowHidden
        size="small"
        height={!isMobile && '35rem'}
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

export default connect(mapStateToProps)(withBreakpoints()(ConfigureModal))
