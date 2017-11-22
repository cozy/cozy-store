import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'

import UninstallModal from './UninstallModal'
import InstallModal from './InstallModal'
import ApplicationPage from './ApplicationPage'

export class ApplicationRouting extends Component {
  render () {
    const { apps, installedApps, isFetching, isInstalling, parent, history, actionError, fetchError } = this.props
    const appsArray = apps || installedApps || []
    return (
      <div>
        <Route path={`/${parent}/:appSlug`} render={({ match }) => {
          if (isFetching) return
          if (appsArray.length && match.params) {
            const app = appsArray.find(app => app.slug === match.params.appSlug)
            if (!app) return history.push(`/${parent}`)
            return <ApplicationPage app={app} parent={parent} />
          }
        }} />
        <Route path={`/${parent}/:appSlug/manage`} render={({ match }) => {
          if (isFetching) return
          if (appsArray.length && match.params) {
            const app = appsArray.find(app => app.slug === match.params.appSlug)
            if (!app) return history.push(`/${parent}`)
            if (app && app.installed) {
              return <UninstallModal
                uninstallApp={this.props.uninstallApp}
                parent={`/${parent}`}
                uninstallError={actionError}
                app={app}
              />
            } else {
              return <InstallModal
                installApp={this.props.installApp}
                parent={`/${parent}`}
                installError={actionError}
                fetchError={fetchError}
                app={app}
                isInstalling={isInstalling}
                isFetching={isFetching}
              />
            }
          }
        }} />
      </div>
    )
  }
}

export default withRouter(ApplicationRouting)
