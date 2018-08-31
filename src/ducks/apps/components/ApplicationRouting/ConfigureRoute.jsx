import React from 'react'
import { Route } from 'react-router-dom'

import IntentModal from 'cozy-ui/react/IntentModal'
import { APP_TYPE } from 'ducks/apps'

const ConfigureRoute = ({ getApp, isFetching, parent, redirectTo }) => (
  <Route
    path={`/${parent}/:appSlug/configure`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      if (!app) return redirectTo(`/${parent}`)
      const goToApp = () => history.replace(`/${parent}/${app.slug}`)
      if (app && app.installed && app.type === APP_TYPE.KONNECTOR) {
        return (
          <IntentModal
            action="CREATE"
            doctype="io.cozy.accounts"
            options={{ slug: app.slug }}
            dismissAction={goToApp}
            onComplete={goToApp}
            mobileFullscreen
            overflowHidden
            size="small"
            height="35rem"
          />
        )
      } else {
        return goToApp()
      }
    }}
  />
)

export default ConfigureRoute
