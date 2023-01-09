import React from 'react'
import Sections from './Sections'
import isNavigationEnabled from 'lib/isNavigationEnabled'
import { useNavigateNoUpdates, useLocationNoUpdates } from 'lib/RouterUtils'
import omit from 'lodash/omit'
import { useMemo } from 'react'

// These query parameters won't be handled by the AppSection component
const FILTER_BLACK_LIST = ['connector_open_uri']

const parseURLSearchParams = urlParams => {
  return Array.from(urlParams.keys()).reduce((acc, key) => {
    const value = urlParams.get(key)
    if (value) {
      switch (value) {
        case 'false': {
          acc[key] = false
          break
        }
        case 'true': {
          acc[key] = true
          break
        }
        case 'undefined': {
          acc[key] = undefined
          break
        }
        case 'null': {
          acc[key] = null
          break
        }
        default: {
          acc[key] = value
        }
      }
    }
    return acc
  }, {})
}

const getFilterFromQuery = (query, parent) => {
  const usp = new URLSearchParams(query)
  const params = parseURLSearchParams(usp)
  // Add showMaintenance by default to false
  if (params.showMaintenance == undefined && parent !== 'myapps') {
    params.showMaintenance = false
  }
  return omit(params, FILTER_BLACK_LIST)
}

const queryFromFilter = filter => {
  const usp = new URLSearchParams(filter)
  return usp.toString()
}

/**
 * Renders a controlled Sections whose filter is stored in
 * the querystring.
 *
 * - saves the current filter to the querystring on filter change
 * - restores the filter from the querystring on reload
 * - handles location updates
 */
const QuerystringSections = props => {
  const navigate = useNavigateNoUpdates()
  const { pathname, search } = useLocationNoUpdates()

  // Restores the search from the URL querypart
  const filter = useMemo(() => getFilterFromQuery(search, parent), [search])

  // Saves filter to query part
  const handleFilterChange = filter => {
    if (Object.keys(filter).length) {
      navigate(`${pathname}?${queryFromFilter(filter)}`)
    } else {
      // Remove the query part if filter is empty
      navigate(pathname)
    }
  }

  return (
    <Sections
      {...props}
      hasNav={isNavigationEnabled(search)}
      filter={filter}
      onFilterChange={handleFilterChange}
    />
  )
}

export default QuerystringSections
