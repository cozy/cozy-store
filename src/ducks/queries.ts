import CozyClient, { Q, QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

interface QueryConfig {
  definition: QueryDefinition
  options: QueryOptions
}

type QueryBuilder<T = void> = (params: T) => QueryConfig

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

interface MkHomeCustomShortcutsDirConnParams {
  currentFolderId?: string
  type?: string
  sortAttribute?: string
  sortOrder?: string
}

export const mkHomeCustomShorcutsDirConn: QueryBuilder<
  MkHomeCustomShortcutsDirConnParams
> = ({
  currentFolderId = '',
  type = 'directory',
  sortAttribute = 'name',
  sortOrder = 'asc'
}) => ({
  definition: Q('io.cozy.files')
    .where({
      dir_id: currentFolderId,
      type,
      [sortAttribute]: { $gt: null }
    })
    .partialIndex({
      _id: {
        $ne: 'io.cozy.files.trash-dir'
      }
    })
    .indexFields(['dir_id', 'type', sortAttribute])
    .sortBy([
      { dir_id: sortOrder },
      { type: sortOrder },
      { [sortAttribute]: sortOrder }
    ])
    .limitBy(100),
  options: {
    as: `${type} ${currentFolderId} ${sortAttribute} ${sortOrder}`,
    fetchPolicy
  }
})

export const mkHomeCustomShorcutsConn: QueryBuilder<string[]> = foldersId => ({
  definition: Q('io.cozy.files')
    .where({
      class: 'shortcut',
      dir_id: {
        $in: foldersId
      },
      name: { $gt: null }
    })
    .indexFields(['class', 'dir_id', 'name'])
    .sortBy([{ class: 'asc' }, { dir_id: 'asc' }, { name: 'asc' }])
    .limitBy(100),
  options: {
    as: 'home-shortcuts',
    fetchPolicy
  }
})

export const mkHomeMagicFolderConn: QueryBuilder<
  (key: string) => string
> = t => ({
  definition: Q('io.cozy.files')
    .where({ path: t('home_config_magic_folder') })
    .indexFields(['path']),
  options: {
    as: 'home/io.cozy.files/path=magic-folder',
    fetchPolicy
  }
})
