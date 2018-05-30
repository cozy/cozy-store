import React from 'react'

import Sidebar from './Sidebar'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Discover, MyApplications } from '../apps/Containers'

import Alerter from 'cozy-ui/react/Alerter'

export const App = () => (
  <div className="app-wrapper o-layout--2panes">
    <Alerter />
    <Sidebar />
    <main className="app-content">
      <Switch>
        <Route path="/discover" component={Discover} />
        <Route path="/myapps" component={MyApplications} />
        <Redirect exact from="/" to="/discover" />
        <Redirect from="*" to="/discover" />
      </Switch>
    </main>
  </div>
)

export default App
