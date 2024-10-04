import CozyClient, { Q, QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

interface QueryConfig {
  definition: QueryDefinition | (() => QueryDefinition)
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

export const buildShortcutsQuery: QueryBuilder = () => ({
  definition: Q('io.cozy.files')
    .where({
      class: 'shortcut'
    })
    .indexFields(['class']),
  options: {
    as: 'io.cozy.files/class/shortcut',
    fetchPolicy
  }
})

export const buildFileFromPathQuery: QueryBuilder<string> = path => ({
  definition: Q('io.cozy.files').where({
    path
  }),
  options: {
    as: `io.cozy.files/path/${path ?? 'unknown'}`,
    fetchPolicy
  }
})

export const buildFileByIdQuery: QueryBuilder<string> = fileId => ({
  definition: () => Q('io.cozy.files').getById(fileId ?? 'unknown'),
  options: {
    as: `io.cozy.files/${fileId ?? 'unknown'}`,
    fetchPolicy,
    singleDocData: true
  }
})

export const buildFileByPathsQuery: QueryBuilder<string[]> = paths => ({
  definition: () =>
    Q('io.cozy.files').where({
      path: {
        $in: paths ?? []
      }
    }),
  options: {
    as: `io.cozy.files/path/${(paths ?? []).join('/')}`,
    fetchPolicy,
    enabled: !!paths
  }
})

export const buildFilesByDirIdsQuery: QueryBuilder<string[]> = dirIds => ({
  definition: () =>
    Q('io.cozy.files').where({
      class: 'shortcut',
      dir_id: {
        $in: dirIds ?? []
      }
    }),
  options: {
    as: `io.cozy.files/dirId/${(dirIds ?? []).join('/')}`,
    fetchPolicy,
    enabled: !!dirIds
  }
})
