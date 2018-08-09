import React, { Component } from 'react'

import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import { SubTitle } from 'cozy-ui/react/Text'

import { withRouter } from 'react-router-dom'
import TransparencyLabel from './TransparencyLabel'
import TransparencyModal from './TransparencyModal'
import AnimatedModalHeader from 'ducks/components/AnimatedModalHeader'

export class PermissionsModal extends Component {
  gotoParent() {
    const { app, parent, history } = this.props
    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(`${parent}`)
    }
  }

  render() {
    const { t, app, match, location } = this.props
    // this part must not be wrapped in a component
    // so we get the content using it as a function
    const animatedHeader = AnimatedModalHeader({
      app
    })
    if (!match.isExact && location.pathname === `${match.url}/transparency`) {
      return <TransparencyModal />
    }
    return (
      <Modal secondaryAction={() => this.gotoParent()} mobileFullscreen>
        <ModalContent>
          {animatedHeader}
          <SubTitle className="sto-modal-title">
            {t('permissions.title')}
          </SubTitle>
          <TransparencyLabel app={app} />
        </ModalContent>
      </Modal>
    )
  }
}

export default withRouter(translate()(PermissionsModal))
