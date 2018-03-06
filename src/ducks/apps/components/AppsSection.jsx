import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

import SmallAppItem from '../../components/SmallAppItem'
import { getLocalizedAppProperty } from '../index'

const _renderAppComponent = (app, lang) => {
  return (
    <SmallAppItem
      slug={app.slug}
      developer={app.developer || {}}
      namePrefix={getLocalizedAppProperty(app, 'name_prefix', lang) || ''}
      editor={app.editor || ''}
      icon={app.icon}
      name={getLocalizedAppProperty(app, 'name', lang)}
      installed={app.installed}
      onClick={() => this.onAppClick(app.slug)}
      key={app.slug}
    />
  )
}

export const AppsSection = ({lang, appsList, subtitle}) => {
  return (
    <div className='sto-sections-apps'>
      {subtitle && <h3 className='sto-sections-subtitle'>
        {subtitle}
      </h3>}
      {appsList && !!appsList.length && <div className='sto-sections-list'>
        {appsList.map(
          app => _renderAppComponent(app, lang)
        )}
      </div>}
    </div>
  )
}

export default translate()(AppsSection)
