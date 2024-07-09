import { useQuery } from 'cozy-client'

import { buildShortcutsQuery } from 'ducks/queries'
import { ToutaticeCategories } from 'ducks/AlternativeStore/types'

export const useAlternativeStore = (): ToutaticeCategories => {
  const shortcutsQuery = buildShortcutsQuery()
  const { data, fetchStatus } = useQuery(
    shortcutsQuery.definition,
    shortcutsQuery.options
  ) as { data: ToutaticeCategories; fetchStatus: string }

  if (fetchStatus !== 'loaded') {
    return {
      'Applications Toutatice': [],
      Info: [],
      Espaces: []
    }
  }

  return data
}
