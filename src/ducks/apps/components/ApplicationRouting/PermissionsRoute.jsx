import PermissionsModal from '@/ducks/apps/components/PermissionsModal'
import IntentPermissionsModal from '@/ducks/components/intents/IntentPermissionsModal'
import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

export const PermissionsRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo,
  intentData
}) => {
  const params = useParams()
  const { search } = useLocation()

  if (isFetching) return null

  const app = getApp(params)

  if (!app) return redirectTo(`/${parent}${search}`)

  const Modal = intentData ? IntentPermissionsModal : PermissionsModal

  return <Modal app={app} parent={`/${parent}`} intentData={intentData} />
}

export default PermissionsRoute
