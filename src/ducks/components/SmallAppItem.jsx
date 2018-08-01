import React from 'react'

import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'

import defaultAppIcon from '../../assets/icons/icon-cube.svg'
import { Placeholder } from './AppsLoading'

export const SmallAppItem = ({
  t,
  app,
  name,
  namePrefix,
  onClick,
  isMobile
}) => {
  const { slug, developer = {}, icon, iconToLoad, installed, maintenance } = app
  return (
    // HACK a11y
    // `onKeyDown={(e) => e.keyCode === 13 ? onClick() : null`
    // This syntax make the div accessible.
    <div
      className="sto-small-app-item"
      onKeyDown={e => (e.keyCode === 13 ? onClick() : null)}
      onClick={onClick}
      tabIndex={0}
    >
      <div className="sto-small-app-item-icon-wrapper">
        {iconToLoad ? (
          <div className="sto-small-app-item-icon">
            <Placeholder
              width={isMobile ? '2.5rem' : '3rem'}
              height={isMobile ? '2.5rem' : '3rem'}
            />
          </div>
        ) : icon ? (
          <img
            src={icon}
            alt={`${slug}-icon`}
            width="64"
            height="64"
            className="sto-small-app-item-icon"
          />
        ) : (
          <Icon
            className="sto-small-app-item-icon sto-small-app-item-icon--default blurry"
            width="48"
            height="64"
            icon={defaultAppIcon}
            color="#95999D"
          />
        )}
      </div>
      <div className="sto-small-app-item-desc">
        <h4 className="sto-small-app-item-title">
          {namePrefix ? `${namePrefix} ${name}` : name}
        </h4>
        <p className="sto-small-app-item-developer">
          {`${t('app_item.by')} ${developer.name}`}
        </p>
        {maintenance && (
          <p className="sto-small-app-item-status">
            {t('app_item.maintenance')}
          </p>
        )}
        {installed &&
          !maintenance && (
            <p className="sto-small-app-item-status">
              {t('app_item.installed')}
            </p>
          )}
      </div>
    </div>
  )
}

export default translate()(SmallAppItem)
