import React from 'react'
import { useParams } from 'react-router-dom'

import ConfigureModal from '@/ducks/apps/components/ConfigureModal'

export const ConfigureRoute = ({ getApp, isFetching, parent, redirectTo }) => {
  const params = useParams()

  if (isFetching) return null

  const app = getApp(params)

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
}

export default ConfigureRoute
