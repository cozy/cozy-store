import React from 'react'
import { Route } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { isFlagshipApp } from 'cozy-device-helper'

import InstallModal from 'ducks/apps/components/InstallModal'

export const InstallRoute = ({ getApp, isFetching, parent, redirectTo }) => {
  const params = useParams()

  if (isFetching) return null

  const app = getApp(params)

  if (!app) {
    return redirectTo(`/${parent}`)
  }

  const appPath = `/${parent}/${(app && app.slug) || ''}`
  const configurePath = `${appPath}/configure`
  const redirectToApp = () => redirectTo(appPath)
  const redirectToConfigure = () => {
    if (isFlagshipApp()) {
      redirectToApp()
    } else {
      redirectTo(configurePath)
    }
  }

  return (
    <InstallModal
      app={app}
      onInstalled={redirectToApp}
      dismissAction={redirectToApp}
      redirectToConfigure={redirectToConfigure}
      redirectToApp={redirectToApp}
    />
  )

  // return (
  //   <Route
  //     path={`/${parent}/:appSlug/install`}
  //     render={({ match }) => {
  //       if (isFetching) return null
  //       const app = getApp(match)

  //       if (!app) {
  //         return redirectTo(`/${parent}`)
  //       }

  //       const appPath = `/${parent}/${(app && app.slug) || ''}`
  //       const configurePath = `${appPath}/configure`
  //       const redirectToApp = () => redirectTo(appPath)
  //       const redirectToConfigure = () => {
  //         if (isFlagshipApp()) {
  //           redirectToApp()
  //         } else {
  //           redirectTo(configurePath)
  //         }
  //       }

  //       return (
  //         <InstallModal
  //           app={app}
  //           onInstalled={redirectToApp}
  //           dismissAction={redirectToApp}
  //           redirectToConfigure={redirectToConfigure}
  //           redirectToApp={redirectToApp}
  //         />
  //       )
  //     }}
  //   />
  // )
}

export default InstallRoute
