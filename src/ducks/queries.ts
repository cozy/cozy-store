import CozyClient, { Q, QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

interface QueryConfig {
  definition: QueryDefinition
  options: QueryOptions
}

type QueryBuilder = () => QueryConfig

const older30s = 30 * 1000

export const buildOauthClientsQuery: QueryBuilder = () => ({
  definition: Q('io.cozy.oauth.clients'),
  options: {
    as: 'io.cozy.oauth.clients',
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildDisplaySettingsQuery: QueryBuilder = () => ({
  definition: Q('io.cozy.settings')
    .where({ _id: 'io.cozy.settings.display' })
    .indexFields(['_id']),
  options: {
    as: 'io.cozy.settings.display',
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})
