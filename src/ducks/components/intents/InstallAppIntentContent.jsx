import AppInstallation from '@/ducks/apps/components/AppInstallation'
import InstallSuccess from '@/ducks/apps/components/InstallSuccess'
import OpenAppsIntentRoutes from '@/ducks/components/intents/OpenAppsIntentRoutes'
import { isPermissionsPageToDisplay } from '@/ducks/components/intents/helpers'
import PropTypes from 'prop-types'
import React from 'react'
import { HashRouter } from 'react-router-dom'

const InstallAppIntentContent = ({
  data,
  isInstalled,
  app,
  appData,
  installApp,
  hasWebappSucceed,
  isInstalling,
  onCancel,
  onTerminate,
  compose
}) => {
  const intentData = { data, appData, serviceCompose: compose }

  if (!isInstalled) {
    if (isPermissionsPageToDisplay(data)) {
      return (
        <AppInstallation
          appSlug={app.slug}
          installApp={installApp}
          isInstalling={isInstalling}
          onCancel={onCancel}
        />
      )
    }
    return (
      <HashRouter>
        <OpenAppsIntentRoutes
          intentData={intentData}
          onTerminate={onTerminate}
        />
      </HashRouter>
    )
  }

  if (hasWebappSucceed) {
    return <InstallSuccess app={app} onTerminate={onTerminate} />
  }

  return null
}

InstallAppIntentContent.propTypes = {
  appData: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  hasWebappSucceed: PropTypes.bool.isRequired,
  installApp: PropTypes.func.isRequired,
  isInstalling: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
  onCancel: PropTypes.func.isRequired,
  onTerminate: PropTypes.func.isRequired,
  app: PropTypes.object,
  isInstalled: PropTypes.bool
}

export default InstallAppIntentContent
