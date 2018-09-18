import React from 'react'
import { Route } from 'react-router-dom'

import InstallModal from '../InstallModal'

export const InstallRoute = ({
  actionError,
  getApp,
  installApp,
  isFetching,
  isInstalling,
  parent,
  redirectTo,
  updateApp
}) => (
  <Route
    path={`/${parent}/:appSlug/install`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      if (!app || (app.installed && !app.availableVersion)) {
        // not existing or already installed with the
        // latest version
        return redirectTo(`/${parent}`)
      } else {
        return (
          <InstallModal
            installApp={app.installed ? updateApp : installApp}
            parent={`/${parent}`}
            installError={actionError}
            app={app}
            isInstalling={isInstalling}
          />
        )
      }
    }}
  />
)

export default InstallRoute
