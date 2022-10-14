import React from 'react'
import { Route, useMatch } from 'react-router-dom'

import PermissionsModal from 'ducks/apps/components/PermissionsModal'

const PermissionsModalWrapper = ({
  getApp,
  isFetching,
  parent,
  redirectTo
}) => {
  const match = useMatch()
  if (isFetching) return null
  const app = getApp(match)
  if (!app) return redirectTo(`/${parent}`)
  return <PermissionsModal app={app} parent={`/${parent}`} />
}

export const PermissionsRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo
}) => (
  <Route
    path={`/${parent}/:appSlug/permissions`}
    render={() => {
      return (
        <PermissionsModalWrapper
          getApp={getApp}
          isFetching={isFetching}
          parent={parent}
          redirectTo={redirectTo}
        />
      )
      // const match = useMatch()
      // if (isFetching) return null
      // const app = getApp(match)
      // if (!app) return redirectTo(`/${parent}`)
      // return <PermissionsModal app={app} parent={`/${parent}`} />
    }}
  />
)

export default PermissionsRoute
