import React from 'react'
import { Route } from 'react-router-dom'

import InstallModal from '../InstallModal'

import { APP_TYPE } from 'ducks/apps'

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
      if (isFetching) return null
      const app = getApp(match)

      if (!app) {
        return redirectTo(`/${parent}`)
      }

      const appPath = `/${parent}/${(app && app.slug) || ''}`
      const configurePath = `${appPath}/configure`
      return (
        <InstallModal
          app={app}
          installApp={app.installed ? updateApp : installApp}
          installError={actionError}
          isInstalling={isInstalling}
          onAlreadyInstalled={() => redirectTo(appPath)}
          dismissAction={() => redirectTo(appPath)}
          onSuccess={() => {
            app.type === APP_TYPE.KONNECTOR
              ? redirectTo(configurePath)
              : redirectTo(appPath)
          }}
        />
      )
    }}
  />
)

export default InstallRoute
