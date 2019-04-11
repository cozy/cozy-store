import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { withRouter } from 'react-router-dom'

import {
  getAppsSortedByCategories,
  sortCategoriesAlphabetically,
  getCategoriesSelections
} from 'lib/helpers'
import AppsSection from 'ducks/apps/components/AppsSection'
import DropdownFilter from 'ducks/apps/components/DropdownFilter'
import { APP_TYPE } from 'ducks/apps'
import isNavigationEnabled from 'lib/isNavigationEnabled'

export class Sections extends Component {
  render() {
    const {
      t,
      apps,
      error,
      onAppClick,
      allApps,
      query,
      pushQuery,
      breakpoints = {},
      location
    } = this.props
    const { isMobile, isTablet } = breakpoints

    if (error) return <p className="u-error">{error.message}</p>

    const konnectorsList = getAppsSortedByCategories(
      apps.filter(a => a.type === APP_TYPE.KONNECTOR)
    )
    const konnectorsCategories = sortCategoriesAlphabetically(
      Object.keys(konnectorsList),
      t
    )

    const webAppsList = getAppsSortedByCategories(
      apps.filter(a => a.type === APP_TYPE.WEBAPP)
    )
    const webAppsCategories = sortCategoriesAlphabetically(
      Object.keys(webAppsList),
      t
    )

    const selectOptions = getCategoriesSelections(allApps, t, true)
    const hasNav = isNavigationEnabled(location.search)

    return (
      <div className={`sto-sections ${hasNav ? '' : '--no-nav'}`}>
        {(isMobile || isTablet) && hasNav && (
          <DropdownFilter
            options={selectOptions}
            query={query}
            pushQuery={pushQuery}
          />
        )}
        {!isMobile && !!webAppsCategories.length && (
          <h1 className="sto-sections-title u-title-h1">
            {t('sections.applications')}
          </h1>
        )}
        <div className="sto-sections-section">
          {!!webAppsCategories.length && (
            <div>
              {webAppsCategories.map(cat => {
                return (
                  <AppsSection
                    key={cat}
                    appsList={webAppsList[cat]}
                    subtitle={
                      <h2 className="sto-sections-subtitle u-title-h2">
                        {t(`app_categories.${cat}`)}
                      </h2>
                    }
                    onAppClick={onAppClick}
                  />
                )
              })}
            </div>
          )}
          {!!konnectorsCategories.length && (
            <div>
              <h2 className="sto-sections-subtitle u-title-h2">
                {t('sections.konnectors')}
              </h2>
              {konnectorsCategories.map(cat => {
                return (
                  <AppsSection
                    key={cat}
                    appsList={konnectorsList[cat]}
                    subtitle={
                      <h3 className="sto-sections-subtitle-secondary">
                        {t(`app_categories.${cat}`)}
                      </h3>
                    }
                    onAppClick={onAppClick}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default translate()(withBreakpoints()(withRouter(Sections)))
