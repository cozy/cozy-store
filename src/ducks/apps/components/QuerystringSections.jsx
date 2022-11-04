import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sections from './Sections'
import isNavigationEnabled from 'lib/isNavigationEnabled'
import omit from 'lodash/omit'

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

const getFilterFromQuery = query => {
  const usp = new URLSearchParams(query)
  const params = parseURLSearchParams(usp)
  // Add showMaintenance by default to false
  if (params.showMaintenance == undefined) {
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
class QuerystringSections extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleFilterChange = this.handleFilterChange.bind(this)

    // Restores the search from the URL querypart
    this.state = {
      filter: getFilterFromQuery(props.location.search)
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({
        filter: getFilterFromQuery(nextProps.location.search)
      })
    }
  }

  // Saves filter to query part
  handleFilterChange(filter) {
    const { navigate, location } = this.props
    const pathname = location.pathname
    if (Object.keys(filter).length) {
      navigate(`${pathname}?${queryFromFilter(filter)}`)
    } else {
      // Remove the query part if filter is empty
      navigate(pathname)
    }
  }

  render() {
    const { location } = this.props
    return (
      <Sections
        {...this.props}
        hasNav={isNavigationEnabled(location.search)}
        filter={this.state.filter}
        onFilterChange={this.handleFilterChange}
      />
    )
  }
}

const QuerystringSectionsWrapper = props => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <QuerystringSections {...props} navigate={navigate} location={location} />
  )
}

export default QuerystringSectionsWrapper
