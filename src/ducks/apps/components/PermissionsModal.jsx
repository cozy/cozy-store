import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import PermissionsList from 'ducks/apps/components/PermissionsList'

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
    const { t, app } = this.props

    return (
      <Dialog
        open={true}
        onClose={() => this.gotoParent()}
        title={t('app_modal.permissions.title')}
        content={<PermissionsList app={app} />}
      />
    )
  }
}

export default withRouter(translate()(PermissionsModal))
