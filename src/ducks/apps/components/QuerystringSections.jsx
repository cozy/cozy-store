import { useNavigateNoUpdates, useLocationNoUpdates } from 'lib/RouterUtils'
import isNavigationEnabled from 'lib/isNavigationEnabled'
import omit from 'lodash/omit'
import PropTypes from 'prop-types'
import React from 'react'
import { useMemo } from 'react'

import Sections from './Sections'

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
  console.log('QuerystringSections', props)
  const { intentData } = props
  const navigate = useNavigateNoUpdates()
  const { pathname, search } = useLocationNoUpdates()

  // Restores the search from the URL querypart
  const filter = useMemo(() => getFilterFromQuery(search, props.parent), [
    props.parent,
    search
  ])

  const filterUpdated = useMemo(() => {
    console.log('intentData', intentData)
    if (intentData) {
      return {
        ...filter,
        type: 'konnector',
        ...(intentData.data?.slugList && {
          slugList: intentData.data.slugList
        }),
        ...(intentData.data?.category && {
          category: intentData.data.category
        }),
        ...(intentData.data?.qualificationLabels && {
          qualificationLabels: intentData.data.qualificationLabels
        })
      }
    }
    return {
      slugList: ['mondediplo', 'cesu']
    }
    return filter
  }, [filter, intentData])

  console.log('filterUpdated', filterUpdated)

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
      filter={filterUpdated}
      onFilterChange={handleFilterChange}
      showFilterDropdown={!intentData}
    />
  )
}

QuerystringSections.propTypes = {
  apps: PropTypes.array.isRequired,
  error: PropTypes.object,
  intentData: PropTypes.shape({
    appData: PropTypes.object,
    data: PropTypes.object
  }),
  onAppClick: PropTypes.func.isRequired,
  parent: PropTypes.string.isRequired
}

export default QuerystringSections
