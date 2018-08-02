import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import SmallAppItem from 'ducks/components/SmallAppItem'

const _renderAppComponent = (app, t, onAppClick, isMobile) => {
  return (
    <SmallAppItem
      app={app}
      namePrefix={t(`apps.${app.slug}.name_prefix`, {
        _: app.name_prefix || ''
      })}
      name={t(`apps.${app.slug}.name`, { _: app.name })}
      onClick={() => onAppClick(app.slug)}
      key={app.slug}
      isMobile={isMobile}
    />
  )
}

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
      {appsList &&
        !!appsList.length && (
          <div className="sto-sections-list">
            {appsList.map(app =>
              _renderAppComponent(app, t, onAppClick, isMobile)
            )}
          </div>
        )}
    </div>
  )
}

export default translate()(withBreakpoints()(AppsSection))
