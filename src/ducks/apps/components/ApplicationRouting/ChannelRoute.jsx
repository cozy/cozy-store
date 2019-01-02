import React from 'react'
import { Route } from 'react-router-dom'

import ChannelModal from '../ChannelModal'
import { REGISTRY_CHANNELS } from 'ducks/apps'

export const ChannelRoute = ({
  actionError,
  fetchError,
  getApp,
  isAppFetching,
  isFetching,
  isInstalling,
  parent,
  redirectTo
}) => (
  <Route
    path={`/${parent}/:appSlug/channel/:channel`}
    render={({ match }) => {
      if (isFetching) return null
      const app = getApp(match)
      const appPath = `/${parent}/${(app && app.slug) || ''}`
      if (!app) return redirectTo(`/${parent}`)
      const channel = match.params.channel
      const isChannelAvailable = Object.values(REGISTRY_CHANNELS).includes(
        channel
      )
      if (!isChannelAvailable) {
        return redirectTo(appPath)
      }
      return (
        <ChannelModal
          appSlug={app.slug}
          channel={channel}
          dismissAction={() => redirectTo(appPath)}
          fetchError={fetchError}
          installError={actionError}
          isAppFetching={isAppFetching}
          isInstalling={isInstalling}
          onCurrentChannel={() => redirectTo(appPath)}
          onNotHandled={() => redirectTo(appPath)}
          onSuccess={() => redirectTo(appPath)}
        />
      )
    }}
  />
)

export default ChannelRoute
