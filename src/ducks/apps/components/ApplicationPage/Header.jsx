import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'
import { APP_TYPE, getAppIconProps, openApp } from 'ducks/apps'
import {
  hasPendingUpdate,
  isUnderMaintenance,
  isInstalledAndNothingToReport
} from 'ducks/apps/appStatus'
import AsyncButton from 'ducks/components/AsyncButton'
import compose from 'lodash/flowRight'
import React from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

import { withClient } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import Intents from 'cozy-interapp'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

export const Header = ({
  t,
  app,
  namePrefix,
  name,
  description,
  parent,
  isInstalling,
  breakpoints = {},
  client
}) => {
  const { search } = useLocation()
  const webviewIntent = useWebviewIntent()
  const { slug, installed, type, uninstallable } = app
  const { isMobile } = breakpoints
  const isCurrentAppInstalling = isInstalling === slug

  const handleClick = () => {
    openApp(webviewIntent, app)
  }

  const openConnector = () => {
    if (isFlagshipApp()) {
      return webviewIntent.call('openApp', app.related, app)
    } else {
      const intents = new Intents({ client })
      return intents.redirect('io.cozy.accounts', {
        konnector: app.slug
      })
    }
  }

  const isKonnector = type === APP_TYPE.KONNECTOR
  const isInstallDisabled = !!isUnderMaintenance(app) || isInstalling
  const isUninstallDisabled = !uninstallable || isCurrentAppInstalling
  const appOrKonnectorLabel = isKonnector
    ? t('app_page.webapp.open')
    : t('app_page.konnector.open')

  return (
    <div className="sto-app-header">
      <div className="sto-app-header-icon">
        <AppIcon app={app} className="sto-app-icon" {...getAppIconProps()} />
      </div>
      <div className="sto-app-header-content">
        <h2 className="sto-app-header-title">
          {namePrefix ? `${namePrefix} ${name}` : name}
        </h2>
        <p className="sto-app-header-description">{description}</p>
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
            to={`/${parent}/${slug}/install${search}`}
            theme="primary"
            extension={isMobile ? 'full' : null}
            disabled={isInstallDisabled}
            onClick={isInstallDisabled ? e => e.preventDefault() : null}
            aria-busy={isCurrentAppInstalling}
            icon={cozySmileIcon}
            label={
              hasPendingUpdate(app)
                ? t('app_page.update')
                : t('app_page.install')
            }
          />
        )}
        {installed && (
          <Button
            tag={Link}
            to={`/${parent}/${slug}/uninstall${search}`}
            theme="secondary"
            extension={isMobile ? 'full' : null}
            className={isMobile ? 'u-mt-1' : null}
            onClick={isUninstallDisabled ? e => e.preventDefault() : null}
            disabled={isUninstallDisabled}
            label={t('app_page.uninstall')}
          />
        )}
      </div>
    </div>
  )
}

export default compose(
  connect(state => ({
    isInstalling: state.apps.isInstalling
  })),
  withBreakpoints(),
  translate(),
  withClient
)(Header)
