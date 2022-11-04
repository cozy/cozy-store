import React from 'react'
import { useParams } from 'react-router-dom'

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
}

export default PermissionsRoute
