import React from 'react'

import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'

import defaultAppIcon from '../../assets/icons/icon-cube.svg'
import { Link } from 'react-router-dom'
import Button from 'cozy-ui/react/Button'

export const SmallAppItem = ({
  t,
  slug,
  developer,
  icon,
  name,
  namePrefix,
  installed,
  onClick,
  installedAppLink
}) => {
  const onShortcutAppButton = (e, link) => {
    // prevent from opening parent SmallAppItem link
    // which will lead to the application main page
    e.stopPropagation()
    if (link) window.location.assign(link)
  }
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
      {icon ? (
        <img
          src={icon}
          alt={`${slug}-icon`}
          width="64"
          height="64"
          className="sto-small-app-item-icon"
        />
      ) : (
        <Icon
          className="sto-small-app-item-icon--default blurry"
          width="48"
          height="64"
          icon={defaultAppIcon}
          color="#95999D"
        />
      )}
      <div className="sto-small-app-item-desc">
        <div className="sto-small-app-item-text">
          <h4 className="sto-small-app-item-title">
            {namePrefix ? `${namePrefix} ${name}` : name}
          </h4>
          <p className="sto-small-app-item-detail">
            {developer.name === 'Cozy' ? 'Cozy Cloud Inc.' : developer.name}
          </p>
        </div>
        <div className="sto-small-app-item-buttons">
          {installed ? (
            <Button
              onClick={e => onShortcutAppButton(e, installedAppLink)}
              label={t('app_item.open')}
              theme="secondary"
              className="sto-small-app-item-button"
              size="tiny"
            />
          ) : (
            <Link
              to={`/discover/${slug}/manage`}
              onClick={e => onShortcutAppButton(e)}
              className="c-btn c-btn--regular c-btn--tiny sto-small-app-item-button sto-small-app-item-button-install"
            >
              <span>{t('app_item.install')}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default translate()(SmallAppItem)
