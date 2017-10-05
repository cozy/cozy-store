import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'

import ApplicationDetails from './ApplicationDetails'
import UninstallModal from './UninstallModal'

export class ApplicationRouting extends Component {
  render () {
    const { installedApps, isFetching, parent, history } = this.props
    return (
      <div>
        <Route path={`/${parent}/:appSlug`} render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            if (!app) return history.push(`/${parent}`)
            return <ApplicationDetails app={app} parent={parent} />
          }
        }} />
        <Route path={`/${parent}/:appSlug/manage`} render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            if (!app) return history.push(`/${parent}`)
            return <UninstallModal uninstallApp={this.props.uninstallApp} parent={parent} error={this.props.actionError} app={app} match={match} />
          }
        }} />
      </div>
    )
  }
}

export default withRouter(ApplicationRouting)
