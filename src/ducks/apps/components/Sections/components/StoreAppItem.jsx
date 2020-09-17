import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import AppTile from 'cozy-ui/transpiled/react/AppSections/components/AppTile'

import { getTranslatedManifestProperty } from '../helpers'

const StoreAppItem = ({ app, onClick }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
    return <AppTile
      app={app}
      namePrefix={getTranslatedManifestProperty(app, 'name_prefix', t)}
      name={getTranslatedManifestProperty(app, 'name', t)}
      onClick={onClick}
      isMobile={isMobile}
    />

}

export default StoreAppItem
