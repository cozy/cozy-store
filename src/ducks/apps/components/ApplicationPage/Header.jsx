import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'cozy-ui/react/Icon'
import Button from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'
import defaultAppIcon from 'assets/icons/icon-cube.svg'
import { Placeholder } from 'ducks/components/AppsLoading'

import { APP_TYPE } from 'ducks/apps'
import {
  hasPendingUpdate,
  isUnderMaintenance,
  isInstalledAndNothingToReport
} from 'ducks/apps/appStatus'

export const Header = ({ t, app, namePrefix, name, description, parent }) => {
  const {
    slug,
    icon,
    iconToLoad,
    installed,
    type,
    related,
    uninstallable
  } = app
  const openApp = link => {
    window.location.assign(link)
  }
  const isKonnector = type === APP_TYPE.KONNECTOR
  return (
    <div className="sto-app-header">
      <div className="sto-app-header-icon">
        {iconToLoad ? (
          <Placeholder width="8rem" height="8.25rem" />
        ) : icon ? (
          <img className="sto-app-icon" src={icon} alt={`${slug}-icon`} />
        ) : (
          <Icon
            className="sto-app-icon--default blurry"
            icon={defaultAppIcon}
            height="88px"
            width="88px"
            color="#95999D"
          />
        )}
      </div>
      <div className="sto-app-header-content">
        <h2 className="sto-app-header-title">
          {namePrefix ? `${namePrefix} ${name}` : name}
        </h2>
        <p className="sto-app-header-description">{description}</p>
        {isInstalledAndNothingToReport(app) ? (
          <Button
            onClick={() => openApp(related)}
            className="c-btn"
            icon="openwith"
            label={
              isKonnector
                ? t('app_page.konnector.open')
                : t('app_page.webapp.open')
            }
          />
        ) : (
          <Link
            to={`/${parent}/${slug}/install`}
            className="c-btn c-btn--regular"
            disabled={!!isUnderMaintenance(app)}
            onClick={isUnderMaintenance(app) ? e => e.preventDefault() : null}
          >
            <Icon
              icon={cozySmileIcon}
              color="#FFFFFF"
              width="16px"
              height="16px"
              className="sto-app-install-button-icon"
            />
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
            className="c-btn c-btn--danger-outline sto-app-header-uninstall-button"
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
