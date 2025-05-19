import { APP_TYPE, openApp } from '@/ducks/apps'
import {
  hasPendingUpdate,
  isUnderMaintenance,
  isInstalledAndNothingToReport
} from '@/ducks/apps/appStatus'
import AsyncButton from '@/ducks/components/AsyncButton'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
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
          component={Link}
          to={`/${parent}/${app.slug}/install${search}`}
          fullWidth={isMobile ? true : false}
          disabled={isInstallDisabled}
          startIcon={<Icon icon={CloudIcon} />}
          label={
            hasPendingUpdate(app) ? t('app_page.update') : t('app_page.install')
          }
          aria-busy={isCurrentAppInstalling}
          onClick={isInstallDisabled ? e => e.preventDefault() : null}
        />
      )}
      {app.installed && (
        <Button
          className={isMobile ? 'u-mt-1' : null}
          component={Link}
          to={`/${parent}/${app.slug}/uninstall${search}`}
          variant="secondary"
          fullWidth={isMobile ? true : false}
          disabled={isUninstallDisabled}
          label={t('app_page.uninstall')}
          onClick={isUninstallDisabled ? e => e.preventDefault() : null}
        />
      )}
    </>
  )
}

export { HeaderActions }
