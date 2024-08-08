import { useMemo } from 'react'

import { useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import { useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { buildShortcutsQuery } from 'ducks/queries'
import { transformData } from 'ducks/AlternativeStore/transformData'
import {
  AltStoreSourceShortcut,
  AltStoreConfig
} from 'ducks/AlternativeStore/types'
import { generateI18nConfig } from 'ducks/AlternativeStore/helpers'

export const useAlternativeStore = (): {
  alternativeApps: AltStoreSourceShortcut[]
} => {
  const shortcutsQuery = buildShortcutsQuery()
  const { data, fetchStatus } = useQuery(
    shortcutsQuery.definition,
    shortcutsQuery.options
  ) as { data: AltStoreSourceShortcut[]; fetchStatus: string }
  const config = flag('store.alternative-source') as AltStoreConfig | undefined

  const i18nConfig = generateI18nConfig(config?.categories)
  useExtendI18n(i18nConfig)

  const alternativeApps = useMemo(() => {
    if (fetchStatus !== 'loaded' || !config) {
      return []
    }
    return transformData(data, config)
  }, [data, fetchStatus, config])

  return { alternativeApps }
}
