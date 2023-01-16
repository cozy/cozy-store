import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export const IntentRedirect = () => {
  const location = useLocation()
  const queryString = !!location && location.search
  const query =
    queryString &&
    queryString
      .substring(1)
      .split('&')
      .reduce((accumulator, keyValue) => {
        const splitted = keyValue.split('=')
        accumulator[splitted[0]] = splitted[1] || true
        return accumulator
      }, {})

  if (query.slug) {
    switch (query.step) {
      case 'install':
        return <Navigate to={`/discover/${query.slug}/install`} replace />
      case 'update':
        return <Navigate to={`/discover/${query.slug}/install`} replace />
      case 'uninstall':
        return <Navigate to={`/discover/${query.slug}/uninstall`} replace />
      case 'permissions':
        return <Navigate to={`/discover/${query.slug}/permissions`} replace />
      default:
        return <Navigate to={`/discover/${query.slug}`} replace />
    }
  }
  return <Navigate to={`/discover/${queryString}`} replace />
}

export default IntentRedirect
