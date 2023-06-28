import React from 'react'

import {
  useQueryAll,
  useQuery,
  isQueryLoading,
  hasQueryBeenLoaded
} from 'cozy-client'
import {
  buildOauthClientsQuery,
  buildDisplaySettingsQuery
} from '../../queries'
import PushBanners from './PushBanners'

const PushBannersLoader = () => {
  const oAuthClientsQuery = buildOauthClientsQuery()
  const { data: oAuthClients, ...oAuthClientsQueryResult } = useQueryAll(
    oAuthClientsQuery.definition,
    oAuthClientsQuery.options
  )

  const isOauthClientsQueryLoading =
    isQueryLoading(oAuthClientsQueryResult) || oAuthClientsQueryResult.hasMore

  const displaySettingsQuery = buildDisplaySettingsQuery()
  const { data: displaySettings, ...displaySettingsQueryResult } = useQuery(
    displaySettingsQuery.definition,
    displaySettingsQuery.options
  )

  const isDisplaySettingsQueryLoading =
    isQueryLoading(displaySettingsQueryResult) &&
    !hasQueryBeenLoaded(displaySettingsQueryResult)

  if (isOauthClientsQueryLoading || isDisplaySettingsQueryLoading) return null

  return (
    <PushBanners oAuthClients={oAuthClients} setting={displaySettings[0]} />
  )
}

export default PushBannersLoader
