import React from 'react'
import { Route } from 'react-router-dom'

import UninstallModal from '../UninstallModal'

export const UninstallRoute = ({
  actionError,
  getApp,
  isFetching,
  parent,
  redirectTo
}) => (
  <Route
    path={`/${parent}/:appSlug/uninstall`}
    render={({ match }) => {
      if (isFetching) return
      const parentPath = `/${parent}`
      const app = getApp(match)
      if (!app) return redirectTo(parentPath)
      const appPath = `${parentPath}/${app.slug}`
      return (
        <UninstallModal
          appSlug={app.slug}
          dismissAction={() => redirectTo(appPath)}
          onNotInstalled={() => redirectTo(appPath)}
          onSuccess={() => redirectTo(appPath)}
          uninstallError={actionError}
        />
      )
    }}
  />
)

export default UninstallRoute
