import React from 'react'

import IntentHeader from 'cozy-ui/transpiled/react/IntentHeader'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import AppInstallationDeprecated from 'ducks/apps/components/deprecated/AppInstallation'
import InstallSuccessDeprecated from 'ducks/apps/components/deprecated/InstallSuccess'

/**
 * @deprecated
 */
const InstallAppIntentContent = ({
  appData,
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
    <div className="coz-intent-wrapper">
      <IntentHeader
        appEditor={appData.app.editor}
        appName={appData.app.name}
        appIcon={`../${appData.app.icon}`}
      />
      <div className={`coz-intent-content${fetching ? ' --loading' : ''}`}>
        {fetching && <Spinner size="xxlarge" noMargin />}
        {error && <div className="coz-error">{error.message}</div>}
        {isReadyWithoutErrors &&
          (!isInstalled ? (
            <AppInstallationDeprecated
              appSlug={app.slug}
              installApp={installApp}
              isInstalling={isInstalling}
              onCancel={onCancel}
            />
          ) : (
            hasWebappSucceed && (
              <InstallSuccessDeprecated app={app} onTerminate={onTerminate} />
            )
          ))}
      </div>
    </div>
  )
}

export default InstallAppIntentContent
