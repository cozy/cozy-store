import React from 'react'
import { Route, useParams } from 'react-router-dom'

import ChannelModal from 'ducks/apps/components/ChannelModal'
import { REGISTRY_CHANNELS } from 'ducks/apps'

export const ChannelRoute = ({ getApp, isFetching, parent, redirectTo }) => {
  const params = useParams()
  if (isFetching) return null
  const app = getApp(params)
  const appPath = `/${parent}/${(app && app.slug) || ''}`
  if (!app) return redirectTo(`/${parent}`)
  const channel = params.channel
  const isChannelAvailable = Object.values(REGISTRY_CHANNELS).includes(channel)
  if (!isChannelAvailable) {
    return redirectTo(appPath)
  }
  return (
    <ChannelModal
      appSlug={app.slug}
      channel={channel}
      dismissAction={() => redirectTo(appPath)}
      onCurrentChannel={() => redirectTo(appPath)}
      onNotHandled={() => redirectTo(appPath)}
      onSuccess={() => redirectTo(appPath)}
    />
  )
  // <Route
  //   path={`/${parent}/:appSlug/channel/:channel`}
  //   render={({ match }) => {
  //     if (isFetching) return null
  //     const app = getApp(match)
  //     const appPath = `/${parent}/${(app && app.slug) || ''}`
  //     if (!app) return redirectTo(`/${parent}`)
  //     const channel = match.params.channel
  //     const isChannelAvailable = Object.values(REGISTRY_CHANNELS).includes(
  //       channel
  //     )
  //     if (!isChannelAvailable) {
  //       return redirectTo(appPath)
  //     }
  //     return (
  //       <ChannelModal
  //         appSlug={app.slug}
  //         channel={channel}
  //         dismissAction={() => redirectTo(appPath)}
  //         onCurrentChannel={() => redirectTo(appPath)}
  //         onNotHandled={() => redirectTo(appPath)}
  //         onSuccess={() => redirectTo(appPath)}
  //       />
  //     )
  //   }}
  // />
}

export default ChannelRoute
