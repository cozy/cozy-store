import React, { Component, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import sortBy from 'lodash/sortBy'
import debounce from 'lodash/debounce'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { translate, useI18n } from 'cozy-ui/transpiled/react/I18n'
import AppSections from 'cozy-ui/transpiled/react/AppSections'
import * as filterUtils from 'cozy-ui/transpiled/react/AppSections/search'

import flag from 'cozy-flags'

import { dumpMatches } from 'ducks/search/utils'
import { SearchField, SearchResults } from 'ducks/search/components'

/**
 * Shows a list of apps grouped by categories.
 * Has a search input. When the search input is filled, only search
 * results will be shown.
 *
 * A filter can be used in a controlled or uncontrolled way.
 *
 * - uncontrolled: it controls an internal filter object (state.filter) to
 *   filter the list of apps.
 * - controlled: the `filter` is taken from the props
 *
 * Additionally, `apps` that are kept after applying this 1st filter can
 * be searched through the `state.searchFieldValue` value.
 */
export class Sections extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      filter: {},
      searchFieldValue: ''
    }

    // getFilteredApps is set here because it needs state.filter already declared
    this.state.filteredApps = this.getFilteredApps()

    this.setupFuse()
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleChangeSearchFieldChange = this.handleChangeSearchFieldChange.bind(
      this
    )
    this.updateSearchResults = debounce(this.updateSearchResults, 300)
  }

  setupFuse() {
    const { lang } = this.props
    const options = {
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 3,
      threshold: 0.2,
      ignoreLocation: true,
      keys: [
        { name: 'name', weight: 3 },
        'categories',
        `locales.${lang}.short_description`,
        `locales.${lang}.long_description`
      ]
    }

    const { filteredApps } = this.state

    const appsForSearch = filteredApps.map(app => ({
      ...app,
      doctypes: app.permissions
        ? Object.values(app.permissions).map(x => x.type)
        : null
    }))
    this.fuse = new Fuse(appsForSearch, options)
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.filter !== this.props.filter ||
      prevProps.apps !== this.props.apps
    ) {
      this.updateFilteredApps()
      this.setState({ searchResults: null, searchFieldValue: '' })
    }
  }

  getFilteredApps() {
    const filter = this.props.filter || this.state.filter
    const filterMatcher = filterUtils.makeMatcherFromSearch(filter)
    const filteredApps = this.props.apps.filter(filterMatcher)
    return filteredApps
  }

  updateFilteredApps() {
    this.setState({ filteredApps: this.getFilteredApps() }, () => {
      this.setupFuse()
    })
  }

  handleChangeSearchFieldChange(searchFieldValue) {
    this.setState({
      searchFieldValue
    })
    this.updateSearchResults(searchFieldValue)
  }

  /** Performs the fuse search, is debounced in the constructor */
  updateSearchResults(searchFieldValue) {
    const searchResults = searchFieldValue
      ? this.fuse.search(searchFieldValue)
      : null
    this.setState({ searchResults })
  }

  handleFilterChange(filter) {
    if (typeof this.props.onFilterChange === 'function') {
      this.props.onFilterChange(filter)
    }
  }

  render() {
    const { error, onAppClick, filter } = this.props
    const { searchFieldValue, searchResults } = this.state

    if (error) return <p className="u-error">{error.message}</p>

    return (
      <div className="sto-sections u-mt-2">
        {flag('store.search') ? (
          <SearchField
            value={searchFieldValue}
            onChange={this.handleChangeSearchFieldChange}
          />
        ) : null}
        {searchResults ? (
          <SearchResults
            searchResults={searchResults}
            onAppClick={onAppClick}
          />
        ) : (
          <AppSections
            search={filter}
            onSearchChange={this.handleFilterChange}
            apps={this.props.apps}
            onAppClick={onAppClick}
          />
        )}
      </div>
    )
  }
}

Sections.propTypes = {
  apps: PropTypes.array.isRequired,
  error: PropTypes.object,
  onAppClick: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func
}

export default translate()(Sections)
