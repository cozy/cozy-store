import React, { Component } from 'react'

import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { withRouter } from 'react-router-dom'
import PermissionsList from './PermissionsList'

export class PermissionsModal extends Component {
  gotoParent() {
    const { app, parent, history } = this.props
    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(`${parent}`)
    }
  }

  render(props) {
    const { app } = props
    return (
      <Modal secondaryAction={() => this.gotoParent()}>
        <ModalContent>
          <PermissionsList app={app} />
        </ModalContent>
      </Modal>
    )
  }
}

export default withRouter(PermissionsModal)
