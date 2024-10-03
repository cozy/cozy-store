import { isShortcutFile } from 'ducks/AlternativeStore/helpers'
import { getAppIconProps } from 'ducks/apps'
import React from 'react'
import { connect } from 'react-redux'

import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

import { HeaderActions } from './HeaderActions'
import { HeaderShortcutActions } from './HeaderShortcutActions'

export const Header = ({
  app,
  namePrefix,
  name,
  description,
  parent,
  isInstalling,
  intentData
}) => (
  <div className="sto-app-header">
    <div className="sto-app-header-icon">
      <AppIcon app={app} className="sto-app-icon" {...getAppIconProps()} />
    </div>
    <div className="sto-app-header-content">
      <h2 className="sto-app-header-title">
        {namePrefix ? `${namePrefix} ${name}` : name}
      </h2>
      <p className="sto-app-header-description">{description}</p>
      {isShortcutFile(app) ? (
        <HeaderShortcutActions app={app} isInstalling={isInstalling} />
      ) : (
        <HeaderActions
          app={app}
          intentData={intentData}
          parent={parent}
          isInstalling={isInstalling}
        />
      )}
    </div>
  </div>
)

export default connect(state => ({
  isInstalling: state.apps.isInstalling
}))(Header)
