import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import compose from 'lodash/flowRight'

import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Intents from 'cozy-interapp'
import { withClient } from 'cozy-client'

import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'
import AsyncButton from 'ducks/components/AsyncButton'

import { APP_TYPE, getAppIconProps } from 'ducks/apps'
import {
  hasPendingUpdate,
  isUnderMaintenance,
  isInstalledAndNothingToReport
} from 'ducks/apps/appStatus'

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
  const { slug, installed, type, related, uninstallable } = app
  const { isMobile } = breakpoints
  const isCurrentAppInstalling = isInstalling === slug
  const openApp = link => {
    window.location.assign(link)
  }
  const isKonnector = type === APP_TYPE.KONNECTOR
  const isInstallDisabled = !!isUnderMaintenance(app) || isInstalling
  const isUninstallDisabled = !uninstallable || isCurrentAppInstalling
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
              asyncAction={() => {
                const intents = new Intents({ client })
                return intents.redirect('io.cozy.accounts', {
                  konnector: app.slug
                })
              }}
              className="c-btn"
              icon="openwith"
              label={t('app_page.konnector.open')}
            />
          ) : (
            <Button
              onClick={() => openApp(related)}
              className="c-btn"
              icon="openwith"
              label={t('app_page.webapp.open')}
            />
          )
        ) : (
          <Button
            tag={Link}
            to={`/${parent}/${slug}/install`}
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
            to={`/${parent}/${slug}/uninstall`}
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
