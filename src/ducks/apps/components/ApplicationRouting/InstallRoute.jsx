import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import { useClient, deconstructCozyWebLinkWithSlug } from 'cozy-client'

import InstallModal from 'ducks/apps/components/InstallModal'
import { openApp } from 'ducks/apps'

export const InstallRoute = ({ getApp, isFetching, parent, redirectTo }) => {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const webviewIntent = useWebviewIntent()
  const client = useClient()

  if (isFetching) return null

  const app = getApp(params)

  if (!app) {
    return redirectTo(`/${parent}`)
  }

  const appPath = `/${parent}/${(app && app.slug) || ''}`
  const configurePath = `${appPath}/configure`

  const redirectToApp = () => redirectTo(appPath)

  const redirectToConfigure = () => {
    const redirectionPath = searchParams.get('redirectAfterInstall')

    if (redirectionPath) {
      const subDomainType = client.getInstanceOptions().subdomain
      const { slug } = deconstructCozyWebLinkWithSlug(
        redirectionPath,
        subDomainType
      )
      return openApp(webviewIntent, {
        slug,
        related: redirectionPath
      })
    }

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
}

export default InstallRoute
