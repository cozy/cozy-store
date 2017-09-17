
import React from 'react'

import Sidebar from './Sidebar'
import { Route, Switch, Redirect } from 'react-router-dom'

import { MyApplications, Discover } from '../apps/Containers'
import { Alerter } from 'cozy-ui/react/Alerter'

export const App = () => (
  <div className='sto-wrapper coz-sticky'>
    <Alerter />
    <Sidebar />
    <main className='sto-content'>
      <Switch>
        <Route path='/discover' component={Discover} />
        <Route path='/myapps' component={MyApplications} />
        <Redirect exact from='/' to='/myapps' />
      </Switch>
    </main>
  </div>
)

export default App
