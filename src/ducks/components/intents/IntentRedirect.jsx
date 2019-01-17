import React from 'react'
import { Redirect } from 'react-router-dom'

export const IntentRedirect = ({ location }) => {
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
        return <Redirect to={`/discover/${query.slug}/install`} />
      case 'update':
        return <Redirect to={`/discover/${query.slug}/install`} />
      case 'uninstall':
        return <Redirect to={`/discover/${query.slug}/uninstall`} />
      case 'permissions':
        return <Redirect to={`/discover/${query.slug}/permissions`} />
      default:
        return <Redirect to={`/discover/${query.slug}`} />
    }
  }
  return <Redirect to={`/discover/${queryString}`} />
}

export default IntentRedirect
