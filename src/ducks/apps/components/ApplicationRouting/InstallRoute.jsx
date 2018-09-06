import React from 'react'
import { Route } from 'react-router-dom'

import Install from '../Install'

export const InstallRoute = ({
  actionError,
  getApp,
  installApp,
  isFetching,
  isInstalling,
  parent,
  redirectTo
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
          <Install
            installApp={installApp}
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
