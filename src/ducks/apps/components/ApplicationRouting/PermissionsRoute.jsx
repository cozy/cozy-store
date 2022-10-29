import React from 'react'
import { Route, useMatch, useParams } from 'react-router-dom'

import PermissionsModal from 'ducks/apps/components/PermissionsModal'

export const PermissionsRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo
}) => {
  const params = useParams()

  if (isFetching) return null

  const app = getApp(params)

  if (!app) return redirectTo(`/${parent}`)

  return <PermissionsModal app={app} parent={`/${parent}`} />

  // <Route
  //   path={`/${parent}/:appSlug/permissions`}
  //   render={() => {
  //     return (
  //       <PermissionsModalWrapper
  //         getApp={getApp}
  //         isFetching={isFetching}
  //         parent={parent}
  //         redirectTo={redirectTo}
  //       />
  //     )
  //     // const match = useMatch()
  //     // if (isFetching) return null
  //     // const app = getApp(match)
  //     // if (!app) return redirectTo(`/${parent}`)
  //     // return <PermissionsModal app={app} parent={`/${parent}`} />
  //   }}
  // />
}

export default PermissionsRoute
