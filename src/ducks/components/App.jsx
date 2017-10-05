
import React from 'react'

import Sidebar from './Sidebar'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Discover, HiddenInstallerView, MyApplications } from '../apps/Containers'
import { Alerter } from 'cozy-ui/react/Alerter'

export const App = () => (
  <div className='sto-wrapper coz-sticky'>
    <Alerter />
    <Sidebar />
    <main className='sto-content'>
      <Switch>
        <Route path='/discover' component={Discover} />
        <Route path='/install' component={HiddenInstallerView} />
        <Route path='/myapps' component={MyApplications} />
        <Redirect exact from='/' to='/myapps' />
      </Switch>
    </main>
  </div>
)

export default App
