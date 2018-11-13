import React from 'react'
import { Route } from 'react-router-dom'

import ApplicationPage from '../ApplicationPage'

export const AppRoute = ({
  parent,
  getApp,
  isFetching,
  mainPageRef,
  redirectTo
}) => (
  <Route
    path={`/${parent}/:appSlug`}
    render={({ match }) => {
      if (isFetching) return null
      const app = getApp(match)
      if (!app) return redirectTo(`/${parent}`)
      return (
        <ApplicationPage
          app={app}
          parent={parent}
          pauseFocusTrap={!match.isExact}
          mainPageRef={mainPageRef}
        />
      )
    }}
  />
)

export default AppRoute
