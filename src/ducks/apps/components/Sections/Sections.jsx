import Fuse from 'fuse.js'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import flag from 'cozy-flags'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import AppSections from 'cozy-ui-plus/dist/AppSections'
import * as filterUtils from 'cozy-ui-plus/dist/AppSections/search'

import Filters from './components/Filters'

import { SearchField, SearchResults } from '@/ducks/search/components'

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
const Sections = ({
  apps,
  error,
  onAppClick,
  filter,
  onFilterChange,
  showFilterDropdown,
  intentData
}) => {
  const { lang } = useI18n()

  const previousFilter = useRef()
  const [internalFilter, setInternalFilter] = useState({})
  const [searchFieldValue, setSearchFieldValue] = useState('')
  const { pathname } = useLocation()

  const options = useMemo(
    () => ({
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
    }),
    [lang]
  )

  const fuse = useMemo(() => {
    const filterMatcher = filterUtils.makeMatcherFromSearch(
      filter || internalFilter
    )
    const filteredApps = apps.filter(filterMatcher).map(app => ({
      ...app,
      doctypes: app.permissions
        ? Object.values(app.permissions).map(x => x.type)
        : null
    }))
    return new Fuse(filteredApps, options)
  }, [apps, filter, internalFilter, options])

  const searchResults = useMemo(() => {
    return searchFieldValue ? fuse.search(searchFieldValue) : null
  }, [fuse, searchFieldValue])

  useEffect(() => {
    const currentFilter = filter || internalFilter
    if (
      !!previousFilter.current &&
      (previousFilter.current.type !== currentFilter.type ||
        previousFilter.current.category !== currentFilter.category)
    ) {
      setSearchFieldValue('')
    }
    previousFilter.current = currentFilter
  }, [filter, internalFilter, previousFilter])

  const handleChangeSearchFieldChange = value => {
    setSearchFieldValue(value)
  }

  const handleFilterChange = filter => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(filter)
    } else {
      setInternalFilter(filter)
    }
  }

  const hasFilters = pathname === '/discover'

  if (error) return <p className="u-error">{error.message}</p>

  return (
    <div className="sto-sections u-mt-2">
      <div className="u-flex u-flex-items-center u-mb-1">
        <SearchField
          value={searchFieldValue}
          onChange={handleChangeSearchFieldChange}
        />
        {!intentData && hasFilters && (
          <Filters
            filter={filter || internalFilter}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>
      {searchResults ? (
        <SearchResults searchResults={searchResults} onAppClick={onAppClick} />
      ) : (
        <AppSections
          config={flag('store.alternative-source')}
          search={filter}
          showFilterDropdown={showFilterDropdown}
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
  filter: PropTypes.object,
  intentData: PropTypes.shape({
    appData: PropTypes.object,
    data: PropTypes.object
  }),
  onAppClick: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func,
  showFilterDropdown: PropTypes.bool
}

export default Sections
