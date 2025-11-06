import { useMemo } from 'react'

import { useQueryAll } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'
import { useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { generateI18nConfig } from '@/ducks/AlternativeStore/helpers'
import { transformData } from '@/ducks/AlternativeStore/transformData'
import {
  AlternativeShortcut,
  AlternativeStoreConfig
} from '@/ducks/AlternativeStore/types'
import { buildFileByPathsQuery, buildFilesByDirIdsQuery } from '@/ducks/queries'

export const useAlternativeStore = (): {
  alternativeApps: AlternativeShortcut[]
  installedAlternativeApps: AlternativeShortcut[]
} => {
  const config = flag<AlternativeStoreConfig | null>('store.alternative-source')
  const categoriesPath = Object.values(config?.categories ?? {})
  const paths = [...categoriesPath, config?.store]

  const foldersQuery = buildFileByPathsQuery(paths)
  const foldersResult = useQueryAll(
    foldersQuery.definition,
    foldersQuery.options
  ) as { data?: IOCozyFile[] }

  const folderIds = foldersResult.data?.map(folder => folder._id)
  const shortcutsQuery = buildFilesByDirIdsQuery(folderIds)
  const { data, fetchStatus } = useQueryAll(
    shortcutsQuery.definition,
    shortcutsQuery.options
  ) as { data?: IOCozyFile[]; fetchStatus: string }

  const i18nConfig = generateI18nConfig(config?.categories)
  useExtendI18n(i18nConfig)

  const alternativeApps = useMemo(() => {
    if (fetchStatus !== 'loaded' || !config || !data) return []

    return transformData(data, config)
  }, [data, fetchStatus, config])

  return {
    alternativeApps,
    installedAlternativeApps: alternativeApps.filter(app => app.installed)
  }
}
