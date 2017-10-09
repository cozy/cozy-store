import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'

import defaultAppIcon from '../../../assets/icons/icon-cube.svg'

export const ApplicationDetails = ({t, lang, app: { description, icon, installed, name, editor, related, slug }, parent}) => {
  const openApp = (related) => { window.location.assign(related) }
  const appDesc = description && (description[lang] || description.en)
  const appName = name && (name[lang] || name.en)
  return (
    <div className='sto-app'>
      <div className='sto-app-icon'>
        {
          icon
          ? <img className='sto-app-item-icon' src={icon} alt={`${slug}-icon`} />
          : <svg className='sto-app-item-icon--default blurry'>
            <use xlinkHref={`#${defaultAppIcon.id}`} />
          </svg>
        }
      </div>
      <div className='sto-app-content'>
        <h2>{editor ? `${editor} ${appName}` : appName}</h2>
        <p>{appDesc}</p>
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
    </div>
  )
}

export default translate()(ApplicationDetails)
