import CozyClient, { Q, QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

interface QueryConfig {
  definition: QueryDefinition
  options: QueryOptions
}

type QueryBuilder<T = void> = (params?: T) => QueryConfig

const fetchPolicy = CozyClient.fetchPolicies.olderThan(30 * 1000) // 30s

export const buildOauthClientsQuery: QueryBuilder = () => ({
  definition: Q('io.cozy.oauth.clients'),
  options: {
    as: 'io.cozy.oauth.clients',
    fetchPolicy
  }
})

export const buildDisplaySettingsQuery: QueryBuilder = () => ({
  definition: Q('io.cozy.settings')
    .where({ _id: 'io.cozy.settings.display' })
    .indexFields(['_id']),
  options: {
    as: 'io.cozy.settings.display',
    fetchPolicy
  }
})

export const buildShortcutsQuery: QueryBuilder<string[]> = () => ({
  definition: Q('io.cozy.files')
    .where({
      class: 'shortcut'
    })
    .indexFields(['class']),
  options: {
    as: 'io.cozy.files/class=shortcut',
    fetchPolicy
  }
})
