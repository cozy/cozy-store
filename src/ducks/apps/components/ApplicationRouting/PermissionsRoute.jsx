import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

import PermissionsModal from 'ducks/apps/components/PermissionsModal'

export const PermissionsRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo
}) => {
  const params = useParams()
  const { search } = useLocation()

  if (isFetching) return null

  const app = getApp(params)

  if (!app) return redirectTo(`/${parent}${search}`)

  return <PermissionsModal app={app} parent={`/${parent}`} />
}

export default PermissionsRoute
