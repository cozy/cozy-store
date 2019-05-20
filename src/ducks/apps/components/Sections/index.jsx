import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import {
  getAppsSortedByCategories,
  sortCategoriesAlphabetically,
  getCategoriesSelections
} from 'lib/helpers'

import AppsSection from './components/AppsSection'
import DropdownFilter from './components/DropdownFilter'
import { APP_TYPE } from './constants'
import isNavigationEnabled from './isNavigationEnabled'
import matches from 'lodash/matches'

const makeOptionMatcherFromSearchParams = params => {
  const typeParam = params.get('type')
  const categoryParam = params.get('category')
  if (typeParam === APP_TYPE.KONNECTOR && !categoryParam) {
    return matches({ value: 'konnectors' })
  } else if (!typeParam && !categoryParam) {
    return matches({ value: 'all' })
  }
  return matches({ value: categoryParam, type: typeParam })
}

export class Sections extends Component {
  handleFilterChange() {
    const { pushQuery } = this.props
    switch (option.value) {
      case 'all':
        return pushQuery()
      case 'konnectors':
        return this.props.pushQuery(`type=${APP_TYPE.KONNECTOR}`)
      default:
        return this.props.pushQuery(`type=${option.type}&category=${option.value}`)
    }
  }

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
    const dropdownDisplayed = hasNav && (isMobile || isTablet)

    const optionMatcher = makeOptionMatcherFromSearchParams(
      this.state.searchParams
    )
    const defaultFilterValue = selectOptions.find(optionMatcher)

    return (
      <div className={`sto-sections${dropdownDisplayed ? '' : ' u-mt-half'}`}>
        {dropdownDisplayed && (
          <DropdownFilter
            defaultValue={defaultFilterValue}
            options={selectOptions}
            onChange={this.handleFilterChange}
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

Sections.propTypes = {
  t: PropTypes.func.isRequired,
  apps: PropTypes.array.isRequired,
  error: PropTypes.object,
  onAppClick: PropTypes.func.isRequired,
  allApps: PropTypes.array.isRequired,
  query: PropTypes.string,
  pushQuery: PropTypes.func
}

export default translate()(withBreakpoints()(withRouter(Sections)))
