import React from 'react'

import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import { getAppIconProps } from 'ducks/apps'
import { getCurrentStatusLabel } from 'ducks/apps/appStatus'

export const SmallAppItem = ({ t, app, name, namePrefix, onClick }) => {
  const { developer = {} } = app
  const statusToDisplay = getCurrentStatusLabel(app)
  return (
    <button type="button" className="sto-small-app-item" onClick={onClick}>
      <div className="sto-small-app-item-icon-wrapper">
        <AppIcon
          app={app}
          className="sto-small-app-item-icon"
          {...getAppIconProps()}
        />
      </div>
      <div className="sto-small-app-item-desc">
        <h4 className="sto-small-app-item-title">
          {namePrefix ? `${namePrefix} ${name}` : name}
        </h4>
        {developer.name && (
          <p className="sto-small-app-item-developer" title={developer.name}>
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
