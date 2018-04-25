import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'cozy-ui/react/Icon'
import Button from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'
import defaultAppIcon from 'assets/icons/icon-cube.svg'

import { APP_TYPE } from 'ducks/apps'

export const Header = ({
  t,
  icon,
  slug,
  namePrefix,
  name,
  type,
  description,
  installed,
  installedAppLink,
  parent
}) => {
  const openApp = link => {
    window.location.assign(link)
  }
  const isKonnector = type === APP_TYPE.KONNECTOR
  return (
    <div className='sto-app-header'>
      <div className='sto-app-header-icon'>
        {icon ? (
          <img className='sto-app-icon' src={icon} alt={`${slug}-icon`} />
        ) : (
          <Icon
            className='sto-app-icon--default blurry'
            icon={defaultAppIcon}
            height='88px'
            width='88px'
            color='#95999D'
          />
        )}
      </div>
      <div className='sto-app-header-content'>
        <h2 className='sto-app-header-title'>
          {namePrefix ? `${namePrefix} ${name}` : name}
        </h2>
        <p>{description}</p>
        {installed ? (
          <div>
            <Button
              onClick={() => openApp(installedAppLink)}
              className="c-btn"
              icon='openwith'
              label={isKonnector
                ? t('app_page.konnector.open')
                : t('app_page.webapp.open')
              }
            />
            <Link
              to={`/${parent}/${slug}/manage`}
              className='c-btn c-btn--danger-outline sto-app-header-uninstall-button'
            >
              <span>{isKonnector
                ? t('app_page.konnector.uninstall')
                : t('app_page.webapp.uninstall')
              }</span>
            </Link>
          </div>
        ) : (
          <Link
            to={`/${parent}/${slug}/manage`}
            className='c-btn c-btn--regular'
          >
            <span>
              <Icon
                icon={cozySmileIcon}
                color='#FFFFFF'
                width='16px'
                height='16px'
                className='sto-app-icon--button'
              />{' '}
              {isKonnector
                ? t('app_page.konnector.install')
                : t('app_page.webapp.install')
              }
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default translate()(Header)
