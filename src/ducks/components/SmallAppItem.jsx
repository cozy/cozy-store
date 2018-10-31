/* global cozy */
import React from 'react'

import AppIcon from 'cozy-ui/react/AppIcon'
import { translate } from 'cozy-ui/react/I18n'

import { fetchIcon } from 'ducks/apps'
import { getCurrentStatusLabel } from 'ducks/apps/appStatus'

export const SmallAppItem = ({ t, app, name, namePrefix, onClick }) => {
  const { developer = {} } = app
  const statusToDisplay = getCurrentStatusLabel(app)
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
        <AppIcon
          app={app}
          className="sto-small-app-item-icon"
          fetchIcon={fetchIcon(cozy.client, app)}
        />
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
    </div>
  )
}

export default translate()(SmallAppItem)
