import React from 'react'
import { Route } from 'react-router-dom'

import ConfigureModal from '../ConfigureModal'

export const ConfigureRoute = ({ getApp, isFetching, parent, redirectTo }) => (
  <Route
    path={`/${parent}/:appSlug/configure`}
    render={({ match }) => {
      if (isFetching) return null
      const app = getApp(match)
      if (!app) return redirectTo(`/${parent}`)
      const appPath = `/${parent}/${app.slug}`
      const redirectToApp = () => redirectTo(appPath)
      return (
        <ConfigureModal
          appSlug={app.slug}
          dismissAction={redirectToApp}
          onNotInstalled={redirectToApp}
          onSuccess={redirectToApp}
          onWebApp={redirectToApp}
        />
      )
    }}
  />
)

export default ConfigureRoute
