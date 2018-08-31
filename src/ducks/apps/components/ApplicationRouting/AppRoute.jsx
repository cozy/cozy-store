import React from 'react'
import { Route } from 'react-router-dom'

import ApplicationPage from '../ApplicationPage'

const AppRoute = ({ parent, getApp, isFetching, redirectTo }) => (
  <Route
    path={`/${parent}/:appSlug`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      if (!app) return redirectTo(`/${parent}`)
      return <ApplicationPage app={app} parent={parent} />
    }}
  />
)

export default AppRoute
