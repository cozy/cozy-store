import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'

import ApplicationDetails from './ApplicationDetails'
import UninstallModal from './UninstallModal'

export class ApplicationRouting extends Component {
  openApp (related) {
    window.location.href = related
  }

  render () {
    const { t, installedApps, isFetching, parent } = this.props
    return (
      <div>
        <Route path={`/${parent}/:appSlug`} render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            return <ApplicationDetails t={t} app={app} openApp={this.openApp} parent={parent} />
          }
        }} />
        <Route path={`/${parent}/:appSlug/manage`} render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            return <UninstallModal uninstallApp={this.props.uninstallApp} parent={parent} error={this.props.actionError} app={app} match={match} />
          }
        }} />
      </div>
    )
  }
}

export default translate()(ApplicationRouting)
