import React from 'react'
import { Route } from 'react-router-dom'

import InstallModal from '../InstallModal'
import { REGISTRY_CHANNELS } from 'ducks/apps'

const ChannelRoute = ({
  actionError,
  fetchError,
  fetchLatestApp,
  getApp,
  installApp,
  isAppFetching,
  isFetching,
  isInstalling,
  parent,
  redirectTo,
  updateApp
}) => (
  <Route
    path={`/${parent}/:appSlug/channel/:channel`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      if (!app || !app.isInRegistry) return redirectTo(`/${parent}`)
      const channel = match.params.channel
      const isChannelAvailable = Object.values(REGISTRY_CHANNELS).includes(
        channel
      )
      if (!isChannelAvailable) {
        return redirectTo(`/${parent}/${app.slug}/manage`)
      }
      return (
        <InstallModal
          installApp={app.installed ? updateApp : installApp}
          parent={`/${parent}`}
          fetchApp={chan => fetchLatestApp(app.slug, chan)}
          isAppFetching={isAppFetching}
          installError={actionError}
          fetchError={fetchError}
          app={app}
          isInstalling={isInstalling}
          channel={channel}
        />
      )
    }}
  />
)

export default ChannelRoute
