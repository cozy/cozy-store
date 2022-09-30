import React, { Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Discover, MyApplications } from 'ducks/apps/Containers'
import IntentRedirect from 'ducks/components/intents/IntentRedirect'

import { enabledPages } from 'config'

const componentsMap = {
  discover: Discover,
  myapps: MyApplications
}

export const AppRouter = () => {
  const defaultPart = enabledPages ? enabledPages[0] : 'discover'

  return (
    <Switch>
      <Route path="/redirect">
        <IntentRedirect />
      </Route>
      {enabledPages.map(name => {
        if (componentsMap[name]) {
          return (
            <Route
              key={name}
              path={`/${name}`}
              component={componentsMap[name]}
            />
          )
        }
      })}
      {defaultPart && (
        <Route path="*" render={() => <Redirect to={`/${defaultPart}`} />} />
      )}
    </Switch>
  )
}
