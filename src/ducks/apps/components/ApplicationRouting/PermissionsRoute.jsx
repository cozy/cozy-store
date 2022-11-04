import React from 'react'
import { Route, useParams } from 'react-router-dom'

import PermissionsModal from 'ducks/apps/components/PermissionsModal'

export const PermissionsRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo
}) => {
  const params = useParams()

  return (
    <Route
      path={`/${parent}/:appSlug/permissions`}
      render={() => {
        if (isFetching) return null

        const app = getApp(params)

        if (!app) return redirectTo(`/${parent}`)

        return <PermissionsModal app={app} parent={`/${parent}`} />
      }}
    />
  )
}

export default PermissionsRoute
