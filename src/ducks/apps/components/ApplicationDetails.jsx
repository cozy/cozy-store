import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'

import { getLocalizedAppProperty } from '../index'
import cozySmileWhiteIcon from '../../../assets/icons/icon-cozy-smile-white.svg'
import defaultAppIcon from '../../../assets/icons/icon-cube.svg'

export const ApplicationDetails = ({t, lang, app, parent}) => {
  const { icon, installed, editor, related, slug } = app
  const openApp = (related) => { window.location.assign(related) }
  const appName = getLocalizedAppProperty(app, 'name', lang)
  const appShortDesc = getLocalizedAppProperty(app, 'short_description', lang)
  const appLongDesc = getLocalizedAppProperty(app, 'long_description', lang)
  const appChanges = getLocalizedAppProperty(app, 'changes', lang)
  return (
    <div className='sto-app'>
      <div className='sto-app-icon-wrapper'>
        {
          icon
          ? <img className='sto-app-icon' src={icon} alt={`${slug}-icon`} />
          : <svg className='sto-app-icon--default blurry'>
            <use xlinkHref={`#${defaultAppIcon.id}`} />
          </svg>
        }
      </div>
      <div className='sto-app-content'>
        <h2>{editor ? `${editor} ${appName}` : appName}</h2>
        <p>{appShortDesc}</p>
        {
          installed
          ? <div>
            <button
              role='button'
              onClick={() => openApp(related)}
              className='coz-btn coz-btn--regular'
            >
              <Icon
                icon='openwith'
                width='10px'
                height='10px'
              /> {t('app.open')}
            </button>
            <Link
              to={`/${parent}/${slug}/manage`}
              className='coz-btn coz-btn--danger-outline'
            >
              {t('app.uninstall')}
            </Link>
          </div>
          : <Link
            to={`/${parent}/${slug}/manage`}
            className='coz-btn coz-btn--regular'
          >
            <Icon
              icon={cozySmileWhiteIcon}
              width='16px'
              height='16px'
              className='sto-app-icon--button'
            /> {t('app.install')}
          </Link>
        }
      </div>
    </div>
  )
}

export default translate()(ApplicationDetails)
