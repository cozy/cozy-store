import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

import AppInstallation from 'ducks/apps/components/AppInstallation'
import InstallSuccess from 'ducks/apps/components/InstallSuccess'

const InstallAppIntentContent = ({
  fetching,
  error,
  isReadyWithoutErrors,
  isInstalled,
  app,
  isInstalling,
  onCancel,
  onTerminate,
  installApp,
  hasWebappSucceed
}) => {
  return (
    <div className={`coz-intent-content${fetching ? ' --loading' : ''}`}>
      {fetching && <Spinner size="xxlarge" noMargin />}
      {error && <div className="coz-error">{error.message}</div>}
      {isReadyWithoutErrors &&
        (!isInstalled ? (
          <AppInstallation
            appSlug={app.slug}
            installApp={installApp}
            isInstalling={isInstalling}
            onCancel={onCancel}
          />
        ) : (
          hasWebappSucceed && (
            <InstallSuccess app={app} onTerminate={onTerminate} />
          )
        ))}
    </div>
  )
}

export default InstallAppIntentContent
