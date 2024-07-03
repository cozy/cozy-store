import CozyClient, { Q } from 'cozy-client'

const older30s = 30 * 1000

export const buildOauthClientsQuery = () => ({
  definition: Q('io.cozy.oauth.clients'),
  options: {
    as: 'io.cozy.oauth.clients',
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildDisplaySettingsQuery = () => ({
  definition: Q('io.cozy.settings')
    .where({ _id: 'io.cozy.settings.display' })
    .indexFields(['_id']),
  options: {
    as: 'io.cozy.settings.display',
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})
