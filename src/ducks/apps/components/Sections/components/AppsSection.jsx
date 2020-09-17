import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { getTranslatedManifestProperty } from '../helpers'
import sortBy from 'lodash/sortBy'
import StoreAppItem from './StoreAppItem'


const makeNameGetter = t => app => getTranslatedManifestProperty(app, 'name', t)

export const AppsSection = ({
  t,
  appsList,
  subtitle,
  onAppClick,
  breakpoints = {}
}) => {
  return (
    <div className="sto-sections-apps">
      {subtitle}
      {appsList && !!appsList.length && (
        <div className="sto-sections-list">
          {sortBy(appsList, makeNameGetter(t)).map(app =>
            <StoreAppItem
              app={app}
              key={app.slug}
              onClick={() => onAppClick(app.slug)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default translate()(withBreakpoints()(AppsSection))
