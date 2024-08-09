import { generateI18nConfig } from 'ducks/AlternativeStore/helpers'
import { transformData } from 'ducks/AlternativeStore/transformData'
import {
  AlternativeShortcut,
  AlternativeStoreConfig
} from 'ducks/AlternativeStore/types'
import { buildShortcutsQuery } from 'ducks/queries'
import { useMemo } from 'react'

import { useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'
import { useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const useAlternativeStore = (): {
  alternativeApps: AlternativeShortcut[]
  installedAlternativeApps: AlternativeShortcut[]
} => {
  const shortcutsQuery = buildShortcutsQuery()
  const { data, fetchStatus } = useQuery(
    shortcutsQuery.definition,
    shortcutsQuery.options
  ) as { data: IOCozyFile[]; fetchStatus: string }
  const config = flag<AlternativeStoreConfig | null>('store.alternative-source')

  const i18nConfig = generateI18nConfig(config?.categories)
  useExtendI18n(i18nConfig)

  const alternativeApps = useMemo(() => {
    if (fetchStatus !== 'loaded' || !config) return []

    return transformData(data, config)
  }, [data, fetchStatus, config])

  return {
    alternativeApps,
    installedAlternativeApps: alternativeApps.filter(app => app.installed)
  }
}
