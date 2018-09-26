import React from 'react'
import { Route } from 'react-router-dom'

import UninstallModal from '../UninstallModal'

export const UninstallRoute = ({
  actionError,
  getApp,
  isFetching,
  isUninstalling,
  parent,
  redirectTo,
  uninstallApp
}) => (
  <Route
    path={`/${parent}/:appSlug/uninstall`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      if (!app || !app.installed || !app.uninstallable) {
        return redirectTo(`/${parent}`)
      } else {
        return (
          <UninstallModal
            uninstallApp={uninstallApp}
            isUninstalling={isUninstalling}
            parent={`/${parent}`}
            uninstallError={actionError}
            app={app}
          />
        )
      }
    }}
  />
)

export default UninstallRoute
