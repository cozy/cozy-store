import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { getTranslatedManifestProperty } from '../helpers'
import sortBy from 'lodash/sortBy'
import SmallAppItem from './SmallAppItem'

const _renderAppComponent = (app, t, onAppClick, isMobile) => {
  return (
    <SmallAppItem
      app={app}
      namePrefix={getTranslatedManifestProperty(app, 'name_prefix', t)}
      name={getTranslatedManifestProperty(app, 'name', t)}
      onClick={() => onAppClick(app.slug)}
      key={app.slug}
      isMobile={isMobile}
    />
  )
}

const appSorter = t => app => getTranslatedManifestProperty(app, 'name', t)

export const AppsSection = ({
  t,
  appsList,
  subtitle,
  onAppClick,
  breakpoints = {}
}) => {
  const { isMobile } = breakpoints
  return (
    <div className="sto-sections-apps">
      {subtitle}
      {appsList && !!appsList.length && (
        <div className="sto-sections-list">
          {sortBy(appsList, appSorter(t)).map(app =>
            _renderAppComponent(app, t, onAppClick, isMobile)
          )}
        </div>
      )}
    </div>
  )
}

export default translate()(withBreakpoints()(AppsSection))
