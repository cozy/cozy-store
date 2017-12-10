import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'

import cozySmileWhiteIcon from 'assets/icons/icon-cozy-smile-white.svg'
import defaultAppIcon from 'assets/icons/icon-cube.svg'

export const Header = ({
  t,
  icon,
  slug,
  editor,
  name,
  description,
  installed,
  installedAppLink,
  parent
}) => {
  const openApp = link => {
    window.location.assign(link)
  }
  return (
    <div className='sto-app-header'>
      <div className='sto-app-header-icon'>
        {icon ? (
          <img className='sto-app-icon' src={icon} alt={`${slug}-icon`} />
        ) : (
          <svg className='sto-app-icon--default blurry'>
            <use xlinkHref={`#${defaultAppIcon.id}`} />
          </svg>
        )}
      </div>
      <div className='sto-app-header-content'>
        <h2 className='sto-app-header-title'>
          {editor ? `${editor} ${name}` : name}
        </h2>
        <p>{description}</p>
        {installed ? (
          <div>
            <button
              role='button'
              onClick={() => openApp(installedAppLink)}
              className='c-btn c-btn--regular'
            >
              <Icon icon='openwith' width='10px' height='10px' />{' '}
              {t('app_page.open')}
            </button>
            <Link
              to={`/${parent}/${slug}/manage`}
              className='c-btn c-btn--danger-outline sto-app-header-uninstall-button'
            >
              {t('app_page.uninstall')}
            </Link>
          </div>
        ) : (
          <Link
            to={`/${parent}/${slug}/manage`}
            className='c-btn c-btn--regular'
          >
            <Icon
              icon={cozySmileWhiteIcon}
              width='16px'
              height='16px'
              className='sto-app-icon--button'
            />{' '}
            {t('app_page.install')}
          </Link>
        )}
      </div>
    </div>
  )
}

export default translate()(Header)
