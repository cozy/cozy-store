import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'


import AppsSection from './components/AppsSection'
import DropdownFilter from './components/DropdownFilter'
import { APP_TYPE } from './constants'



/**
 * Shows a list of apps grouped by categories.
 *
 * Controls an internal search object to filter the list.
 */
export class Sections extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      search: {}
    }
    this.handleSearchOptionChange = this.handleSearchOptionChange.bind(this)
  }

  // Sets state.search from the option received from the DropdownFilter
  handleSearchOptionChange(searchOption) {
    const search = searchUtils.makeSearchFromOption(categoryOption)
    if (!this.props.search) {
      // the component is uncontrolled
      this.setState({
        search
      })
    }
    if (typeof this.props.onSearchChange === 'function') {
      this.props.onSearchChange(search)
    }
  }

  render() {
    const { t, apps, error, onAppClick, breakpoints = {}, hasNav } = this.props
    const { isMobile, isTablet } = breakpoints

    if (error) return <p className="u-error">{error.message}</p>

    // Depending on whether the component is controlled or uncontrolled,
    // search is taken from props or state
    const search = this.props.search || this.state.search
    const searchMatcher = searchUtils.makeMatcherFromSearch(search)
    const filteredApps = apps.filter(searchMatcher)

    const konnectorGroups = catUtils.groupApps(
      filteredApps.filter(a => a.type === APP_TYPE.KONNECTOR)
    )
    const webAppGroups = catUtils.groupApps(
      filteredApps.filter(a => a.type === APP_TYPE.WEBAPP)
    )
    const webAppsCategories = Object.keys(webAppGroups)
      .map(cat => catUtils.addLabel({ value: cat }, t))
      .sort(catUtils.sorter)
    const konnectorsCategories = Object.keys(konnectorGroups)
      .map(cat => catUtils.addLabel({ value: cat }, t))
      .sort(catUtils.sorter)

    const dropdownDisplayed = hasNav && (isMobile || isTablet)
    const rawSelectOptions = catUtils.generateOptionsFromApps(apps, true)
    const selectOptions = rawSelectOptions.map(option =>
      catUtils.addLabel(option, t)
    )
    const optionMatcher = searchUtils.makeOptionMatcherFromSearch(search)
    const defaultFilterValue = selectOptions.find(optionMatcher)

    return (
      <div className={`sto-sections${dropdownDisplayed ? '' : ' u-mt-half'}`}>
        {dropdownDisplayed && (
          <DropdownFilter
            defaultValue={defaultFilterValue}
            options={selectOptions}
            onChange={this.handleSearchOptionChange}
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
                    key={cat.value}
                    appsList={webAppGroups[cat.value]}
                    subtitle={
                      <h2 className="sto-sections-subtitle u-title-h2">
                        {cat.label}
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
                    key={cat.value}
                    appsList={konnectorGroups[cat.value]}
                    subtitle={
                      <h3 className="sto-sections-subtitle-secondary">
                        {cat.label}
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
  hasNav: PropTypes.bool
}

Sections.defaultProps = {
  hasNav: true
}

export default translate()(withBreakpoints()(Sections))
