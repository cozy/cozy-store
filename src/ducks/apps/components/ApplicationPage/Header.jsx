/* global cozy */
import React from 'react'
import { Link } from 'react-router-dom'

import AppIcon from 'cozy-ui/react/AppIcon'
import Button from 'cozy-ui/react/Button'
import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'

import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'
import AsyncButton from 'ducks/components/AsyncButton'

import { APP_TYPE, fetchIcon } from 'ducks/apps'
import {
  hasPendingUpdate,
  isUnderMaintenance,
  isInstalledAndNothingToReport
} from 'ducks/apps/appStatus'

export const Header = ({ t, app, namePrefix, name, description, parent }) => {
  const { slug, installed, type, related, uninstallable } = app
  const openApp = link => {
    window.location.assign(link)
  }
  const isKonnector = type === APP_TYPE.KONNECTOR
  return (
    <div className="sto-app-header">
      <div className="sto-app-header-icon">
        <AppIcon
          app={app}
          className="sto-app-icon"
          fetchIcon={fetchIcon(app)}
        />
      </div>
      <div className="sto-app-header-content">
        <h2 className="sto-app-header-title">
          {namePrefix ? `${namePrefix} ${name}` : name}
        </h2>
        <p className="sto-app-header-description">{description}</p>
        {isInstalledAndNothingToReport(app) ? (
          isKonnector ? (
            <AsyncButton
              asyncAction={() =>
                cozy.client.intents.redirect('io.cozy.accounts', {
                  konnector: app.slug
                })
              }
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
          <Link
            to={`/${parent}/${slug}/install`}
            className="c-btn c-btn--regular"
            disabled={!!isUnderMaintenance(app)}
            onClick={isUnderMaintenance(app) ? e => e.preventDefault() : null}
          >
            <span>
              <Icon
                icon={cozySmileIcon}
                color="#FFFFFF"
                width="16px"
                height="16px"
                className="sto-app-icon--button"
              />{' '}
              {hasPendingUpdate(app)
                ? t('app_page.update')
                : t('app_page.install')}
            </span>
          </Link>
        )}
        {installed && (
          <Link
            to={`/${parent}/${slug}/uninstall`}
            className="c-btn c-btn--secondary sto-app-header-uninstall-button"
            onClick={!uninstallable && (e => e.preventDefault())}
            disabled={!uninstallable}
          >
            <span>{t('app_page.uninstall')}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default translate()(Header)
