import React, { Component } from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { getTranslatedManifestProperty } from 'lib/helpers'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'

export class Partnership extends Component {
  constructor(props) {
    super(props)
    this.state = { isPartnershipIconErrored: false }
  }
  handleBrokenImage = () => {
    this.setState(() => ({ isPartnershipIconErrored: true }))
  }

  render() {
    const { app, t } = this.props
    const { isPartnershipIconErrored } = this.state
    const iconStyle = isPartnershipIconErrored ? { display: 'none' } : {}
    return (
      <div className="sto-partnership">
        {app.partnership.icon && (
          <img
            className="sto-partnership-icon"
            src={app.partnership.icon}
            onError={this.handleBrokenImage}
            ref={this.partnershipIcon}
            style={iconStyle}
          />
        )}
        <span>
          <ReactMarkdownWrapper
            source={getTranslatedManifestProperty(
              app,
              'partnership.description',
              t
            )}
          />
        </span>
      </div>
    )
  }
}

export default translate()(Partnership)
