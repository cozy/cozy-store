import React from 'react'
import { withRouter } from 'react-router'
import Sections from './Sections'
import fromPairs from 'lodash/fromPairs'
import isNavigationEnabled from 'lib/isNavigationEnabled'

const searchFromQuery = query => {
  const usp = new URLSearchParams(query)
  return fromPairs(Array.from(usp.entries()))
}

const queryFromSearch = search => {
  const usp = new URLSearchParams(search)
  return usp.toString()
}

/**
 * Renders a controlled Sections whose filter is stored in
 * the querystring.
 *
 * - saves the current search to the querystring on search change
 * - restores the search from the querystring on reload
 * - handles location updates
 */
class QuerystringSections extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleSearchChange = this.handleSearchChange.bind(this)

    // Restores the search from the URL querypart
    this.state = {
      search: searchFromQuery(props.location.search)
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({
        search: searchFromQuery(nextProps.location.search)
      })
    }
  }

  // Saves search to query part
  handleSearchChange(search) {
    const { history, location } = this.props
    const pathname = location.pathname
    if (Object.keys(search).length) {
      history.push(`${pathname}?${queryFromSearch(search)}`)
    } else {
      // Remove the query part if search is empty
      history.push(pathname)
    }
  }

  render() {
    const { location } = this.props
    return (
      <Sections
        {...this.props}
        hasNav={isNavigationEnabled(location.search)}
        search={this.state.search}
        onSearchChange={this.handleSearchChange}
      />
    )
  }
}

export default withRouter(QuerystringSections)
