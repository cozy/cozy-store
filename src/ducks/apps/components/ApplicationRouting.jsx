import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'

import { InstallModal } from '../currentAppVersion/Containers'

import ApplicationDetails from './ApplicationDetails'
import UninstallModal from './UninstallModal'

export class ApplicationRouting extends Component {
  render () {
    const { apps, installedApps, isFetching, isInstalling, parent, history } = this.props
    const appsArray = apps || installedApps || []
    return (
      <div>
        <Route path={`/${parent}/:appSlug`} render={({ match }) => {
          if (isFetching) return
          if (appsArray.length && match.params) {
            const app = appsArray.find(app => app.slug === match.params.appSlug)
            if (!app) return history.push(`/${parent}`)
            return <ApplicationDetails app={app} parent={parent} />
          }
        }} />
        <Route path={`/${parent}/:appSlug/manage`} render={({ match }) => {
          if (isFetching) return
          if (appsArray.length && match.params) {
            const app = appsArray.find(app => app.slug === match.params.appSlug)
            if (!app) return history.push(`/${parent}`)
            if (app && app.installed) {
              return <UninstallModal uninstallApp={this.props.uninstallApp} parent={`/${parent}`} error={this.props.actionError} app={app} />
            } else {
              return <InstallModal installApp={this.props.installApp} parent={`/${parent}`} error={this.props.actionError} app={app} isInstalling={isInstalling} />
            }
          }
        }} />
      </div>
    )
  }
}

export default withRouter(ApplicationRouting)
