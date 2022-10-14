import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import Sections from './Sections'
import fromPairs from 'lodash/fromPairs'
import isNavigationEnabled from 'lib/isNavigationEnabled'
import omit from 'lodash/omit'

// These query parameters won't be handled by the AppSection component
const FILTER_BLACK_LIST = ['connector_open_uri']

const getFilterFromQuery = query => {
  const usp = new URLSearchParams(query)
  return omit(fromPairs(Array.from(usp.entries())), FILTER_BLACK_LIST)
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

  componentWillUpdate(nextProps) {
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
