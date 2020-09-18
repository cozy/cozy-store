import React from 'react'
import { withRouter } from 'react-router'
import Sections from './Sections'
import fromPairs from 'lodash/fromPairs'
import isNavigationEnabled from 'lib/isNavigationEnabled'

const getFilterFromQuery = query => {
  const usp = new URLSearchParams(query)
  return fromPairs(Array.from(usp.entries()))
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
    const { history, location } = this.props
    const pathname = location.pathname
    if (Object.keys(filter).length) {
      history.push(`${pathname}?${queryFromFilter(filter)}`)
    } else {
      // Remove the query part if filter is empty
      history.push(pathname)
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

export default withRouter(QuerystringSections)
