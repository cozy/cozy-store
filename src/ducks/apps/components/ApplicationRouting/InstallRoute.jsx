import React from 'react'
import { Route } from 'react-router-dom'

import InstallModal from 'ducks/apps/components/InstallModal'

export const InstallRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo,
  connectorOpenUri
}) => (
  <Route
    path={`/${parent}/:appSlug/install`}
    render={({ match }) => {
      if (isFetching) return null
      const app = getApp(match)

      if (!app) {
        return redirectTo(`/${parent}`)
      }

      const appPath = `/${parent}/${(app && app.slug) || ''}`
      const configurePath = `${appPath}/configure`
      const redirectToApp = () => redirectTo(appPath)
      const redirectToConfigure = () => redirectTo(configurePath)
      return (
        <InstallModal
          app={app}
          onInstalled={redirectToApp}
          dismissAction={redirectToApp}
          redirectToConfigure={connectorOpenUri ? null : redirectToConfigure}
          redirectToApp={redirectToApp}
        />
      )
    }}
  />
)

export default InstallRoute
