import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import {
  getAppsSortedByCategories,
  sortCategoriesAlphabetically,
  getCategoriesSelections
} from 'lib/helpers'
import AppsSection from './AppsSection'
import DropdownFilter from './DropdownFilter'
import { APP_TYPE } from '../index'

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
      breakpoints = {}
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

    const selectOptions = getCategoriesSelections(allApps, t)

    return (
      <div className="sto-sections">
        {(isMobile || isTablet) && (
          <DropdownFilter
            options={selectOptions}
            query={query}
            pushQuery={pushQuery}
          />
        )}
        {!!webAppsCategories.length && (
          <div className="sto-sections-section">
            <h2 className="sto-sections-title">{t('sections.applications')}</h2>
            {webAppsCategories.map(cat => {
              return (
                <AppsSection
                  key={cat}
                  appsList={webAppsList[cat]}
                  subtitle={t(`app_categories.${cat}`)}
                  onAppClick={onAppClick}
                />
              )
            })}
          </div>
        )}
        {!!konnectorsCategories.length && (
          <div className="sto-sections-section">
            <h2 className="sto-sections-title">{t('sections.konnectors')}</h2>
            {konnectorsCategories.map(cat => {
              return (
                <AppsSection
                  key={cat}
                  appsList={konnectorsList[cat]}
                  subtitle={t(`app_categories.${cat}`)}
                  onAppClick={onAppClick}
                />
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

export default translate()(withBreakpoints()(Sections))
