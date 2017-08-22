import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import MyApplications from '../containers/MyApplications'
import Discover from '../components/Discover'

const AppRoutes = () => {
  return <Switch>
    <Route path='/discover' component={Discover} />
    <Route path='/myapps' component={MyApplications} />
    <Redirect from='/' to='/myapps' />
  </Switch>
}

export default AppRoutes
