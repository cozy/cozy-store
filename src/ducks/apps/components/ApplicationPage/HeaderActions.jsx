import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'
import { APP_TYPE, openApp } from 'ducks/apps'
import {
  hasPendingUpdate,
  isUnderMaintenance,
  isInstalledAndNothingToReport
} from 'ducks/apps/appStatus'
import AsyncButton from 'ducks/components/AsyncButton'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { handleIntent } from './helpers'

const HeaderActions = ({ app, intentData, parent, isInstalling }) => {
  const client = useClient()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const isCurrentAppInstalling = isInstalling === app.slug
  const { search } = useLocation()
  const webviewIntent = useWebviewIntent()

  const isKonnector = app.type === APP_TYPE.KONNECTOR
  const isInstallDisabled = !!isUnderMaintenance(app) || isInstalling
  const isUninstallDisabled = !app.uninstallable || isCurrentAppInstalling
  const appOrKonnectorLabel = isKonnector
    ? t('app_page.webapp.open')
    : t('app_page.konnector.open')

  const handleClick = () => {
    openApp(webviewIntent, app)
  }

  const openConnector = async () => {
    if (isFlagshipApp()) {
      return webviewIntent?.call('openApp', app.related, app)
    } else {
      handleIntent(client, intentData, app)
    }
  }

  return (
    <>
      {isInstalledAndNothingToReport(app) && !isCurrentAppInstalling ? (
        isKonnector ? (
          <AsyncButton
            asyncAction={openConnector}
            className="c-btn"
            label={appOrKonnectorLabel}
          />
        ) : (
          <Button
            onClick={handleClick}
            className="c-btn"
            label={appOrKonnectorLabel}
          />
        )
      ) : (
        <Button
          tag={Link}
          to={`/${parent}/${app.slug}/install${search}`}
          theme="primary"
          extension={isMobile ? 'full' : null}
          disabled={isInstallDisabled}
          onClick={isInstallDisabled ? e => e.preventDefault() : null}
          aria-busy={isCurrentAppInstalling}
          icon={cozySmileIcon}
          label={
            hasPendingUpdate(app) ? t('app_page.update') : t('app_page.install')
          }
        />
      )}
      {app.installed && (
        <Button
          tag={Link}
          to={`/${parent}/${app.slug}/uninstall${search}`}
          theme="secondary"
          extension={isMobile ? 'full' : null}
          className={isMobile ? 'u-mt-1' : null}
          onClick={isUninstallDisabled ? e => e.preventDefault() : null}
          disabled={isUninstallDisabled}
          label={t('app_page.uninstall')}
        />
      )}
    </>
  )
}

export { HeaderActions }
