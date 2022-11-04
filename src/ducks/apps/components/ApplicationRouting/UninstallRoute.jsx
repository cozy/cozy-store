import React from 'react'
import { Route, useParams } from 'react-router-dom'

import UninstallModal from 'ducks/apps/components/UninstallModal'

export const UninstallRoute = ({ getApp, isFetching, parent, redirectTo }) => {
  const params = useParams()

  return (
    <Route
      path={`/${parent}/:appSlug/uninstall`}
      render={() => {
        if (isFetching) return null

        const parentPath = `/${parent}`
        const app = getApp(params)
        if (!app) return redirectTo(parentPath)

        const appPath = `${parentPath}/${app.slug}`
        return (
          <UninstallModal
            appSlug={app.slug}
            dismissAction={() => redirectTo(appPath)}
            onNotInstalled={() => redirectTo(appPath)}
            onSuccess={() => redirectTo(appPath)}
          />
        )
      }}
    />
  )
}

export default UninstallRoute
