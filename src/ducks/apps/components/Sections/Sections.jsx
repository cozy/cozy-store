import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import AppSections from 'cozy-ui/transpiled/react/AppSections'
import DropdownFilter from './components/DropdownFilter'

import * as searchUtils from './search'
import * as catUtils from './categories'

/**
 * Shows a list of apps grouped by categories.
 *
 * Can be
 *
 * - uncontrolled: it controls an internal search object to filter the list.
 * - controlled: it is controlled by the `search` prop
 */
export class Sections extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      search: {}
    }
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  getSearch() {
    // Depending on whether the component is controlled or uncontrolled,
    // search is taken from props or state
    const search = this.props.search || this.state.search
    return search
  }

  }

  // Sets state.search from the option received from the DropdownFilter
  handleCategoryChange(categoryOption) {
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
    const search = this.getSearch()
    const { isMobile, isTablet } = breakpoints

    if (error) return <p className="u-error">{error.message}</p>

    const dropdownDisplayed = hasNav && (isMobile || isTablet)
    const rawSelectOptions = catUtils.generateOptionsFromApps(apps, {
      includeAll: true
    })
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
            onChange={this.handleCategoryChange}
          />
        )}
          <AppSections apps={filteredApps} onAppClick={onAppClick} />
        )}
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
