import React from 'react'
import { Route } from 'react-router-dom'

import PermissionsModal from 'ducks/apps/components/PermissionsModal'

export const PermissionsRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo
}) => (
  <Route
    path={`/${parent}/:appSlug/permissions`}
    render={({ match }) => {
      if (isFetching) return null
      const app = getApp(match)
      if (!app) return redirectTo(`/${parent}`)
      return <PermissionsModal app={app} parent={`/${parent}`} />
    }}
  />
)

export default PermissionsRoute
