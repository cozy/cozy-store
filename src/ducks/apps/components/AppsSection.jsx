import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import SmallAppItem from 'ducks/components/SmallAppItem'
import { getLocalizedAppProperty } from 'ducks/apps'

const _renderAppComponent = (app, lang, onAppClick, isMobile) => {
  return (
    <SmallAppItem
      app={app}
      namePrefix={getLocalizedAppProperty(app, 'name_prefix', lang) || ''}
      name={getLocalizedAppProperty(app, 'name', lang)}
      onClick={() => onAppClick(app.slug)}
      key={app.slug}
      isMobile={isMobile}
    />
  )
}

export const AppsSection = ({
  lang,
  appsList,
  subtitle,
  onAppClick,
  breakpoints = {}
}) => {
  const { isMobile } = breakpoints
  return (
    <div className="sto-sections-apps">
      {subtitle}
      {appsList &&
        !!appsList.length && (
          <div className="sto-sections-list">
            {appsList.map(app =>
              _renderAppComponent(app, lang, onAppClick, isMobile)
            )}
          </div>
        )}
    </div>
  )
}

export default translate()(withBreakpoints()(AppsSection))
