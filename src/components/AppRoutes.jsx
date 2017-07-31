import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import MyApplications from '../containers/MyApplications'

const AppRoutes = () => {
  return <Switch>
    <Route path='/myapps' component={MyApplications} />
    <Redirect from='/' to='/myapps' />
  </Switch>
}

export default AppRoutes
