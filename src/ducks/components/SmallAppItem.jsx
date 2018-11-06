import React from 'react'

import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'

import defaultAppIcon from 'assets/icons/icon-cube.svg'
import { Placeholder } from './AppsLoading'
import { getCurrentStatusLabel } from 'ducks/apps/appStatus'

export const SmallAppItem = ({
  t,
  app,
  name,
  namePrefix,
  onClick,
  isMobile
}) => {
  const { slug, developer = {}, icon, iconToLoad } = app
  const statusToDisplay = getCurrentStatusLabel(app)

  return (
    <button type="button" className="sto-small-app-item" onClick={onClick}>
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
            aria-hidden={true}
            focusable={false}
          />
        ) : (
          <Icon
            className="sto-small-app-item-icon sto-small-app-item-icon--default blurry"
            width="48"
            height="64"
            icon={defaultAppIcon}
            color="#95999D"
            aria-hidden={true}
            focusable={false}
          />
        )}
      </div>
      <div className="sto-small-app-item-desc">
        <h4 className="sto-small-app-item-title">
          {namePrefix ? `${namePrefix} ${name}` : name}
        </h4>
        {developer.name && (
          <p className="sto-small-app-item-developer">
            {`${t('app_item.by')} ${developer.name}`}
          </p>
        )}
        {statusToDisplay && (
          <p className="sto-small-app-item-status">
            {t(`app_item.${statusToDisplay}`)}
          </p>
        )}
      </div>
    </button>
  )
}

export default translate()(SmallAppItem)
