import { useMemo } from 'react'
import { useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { buildShortcutsQuery } from 'ducks/queries'
import { transformData } from 'ducks/AlternativeStore/transformData'
import {
  AltStoreSourceShortcut,
  AltStoreConfig
} from 'ducks/AlternativeStore/types'

export const useAlternativeStore = (): AltStoreSourceShortcut[] => {
  const shortcutsQuery = buildShortcutsQuery()
  const { data, fetchStatus } = useQuery(
    shortcutsQuery.definition,
    shortcutsQuery.options
  ) as { data: AltStoreSourceShortcut[]; fetchStatus: string }
  const config = flag('store.alternative-source') as AltStoreConfig | undefined

  const transformedData = useMemo(() => {
    if (fetchStatus !== 'loaded' || !config) {
      return []
    }
    return transformData(data, config)
  }, [data, fetchStatus, config])

  return transformedData
}
