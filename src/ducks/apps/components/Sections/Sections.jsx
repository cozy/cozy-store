import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import debounce from 'lodash/debounce'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import AppSections from 'cozy-ui/transpiled/react/AppSections'
import * as filterUtils from 'cozy-ui/transpiled/react/AppSections/search'

import { SearchField, SearchResults } from 'ducks/search/components'
import Filters from './components/Filters'

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
const Sections = ({ apps, error, onAppClick, filter, onFilterChange }) => {
  const { lang } = useI18n()

  const [internalFilter, setInternalFilter] = useState({})
  const [searchFieldValue, setSearchFieldValue] = useState('')
  const [searchResults, setSearchResults] = useState(null)

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

  const appsForSearch = useMemo(() => {
    const filterMatcher = filterUtils.makeMatcherFromSearch(
      filter || internalFilter
    )
    return apps.filter(filterMatcher).map(app => ({
      ...app,
      doctypes: app.permissions
        ? Object.values(app.permissions).map(x => x.type)
        : null
    }))
  }, [apps, filter, internalFilter])

  const onSearchChanged = useMemo(
    () =>
      debounce(value => {
        const fuse = new Fuse(appsForSearch, options)
        setSearchResults(value ? fuse.search(value) : null)
      }, 300),
    [appsForSearch, options]
  )

  useEffect(() => {
    setSearchFieldValue('')
    setSearchResults(null)
  }, [filter, apps])

  const handleChangeSearchFieldChange = value => {
    setSearchFieldValue(value)
    onSearchChanged(value)
  }

  const handleFilterChange = filter => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(filter)
    } else {
      setInternalFilter(filter)
    }
  }

  if (error) return <p className="u-error">{error.message}</p>

  return (
    <div className="sto-sections u-mt-2">
      <div className="u-flex u-flex-items-center u-mb-1">
        <SearchField
          value={searchFieldValue}
          onChange={handleChangeSearchFieldChange}
        />
        <Filters onFilterChange={handleFilterChange} />
      </div>
      {searchResults ? (
        <SearchResults searchResults={searchResults} onAppClick={onAppClick} />
      ) : (
        <AppSections
          search={filter}
          onSearchChange={handleFilterChange}
          apps={apps}
          onAppClick={onAppClick}
        />
      )}
    </div>
  )
}

Sections.propTypes = {
  apps: PropTypes.array.isRequired,
  error: PropTypes.object,
  onAppClick: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func
}

export default Sections
