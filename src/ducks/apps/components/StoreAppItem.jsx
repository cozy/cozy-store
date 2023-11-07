import React from 'react'

import AppTile from 'cozy-ui/transpiled/react/AppTile'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getTranslatedManifestProperty } from './helpers'

const StoreAppItem = ({ app, onClick }) => {
  const { t } = useI18n()
  return (
    <AppTile
      app={app}
      namePrefix={getTranslatedManifestProperty(app, 'name_prefix', t)}
      name={getTranslatedManifestProperty(app, 'name', t)}
      onClick={onClick}
    />
  )
}

export default StoreAppItem
