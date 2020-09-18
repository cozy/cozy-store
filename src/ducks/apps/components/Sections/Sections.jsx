import React, { Component, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import sortBy from 'lodash/sortBy'
import debounce from 'lodash/debounce'

import Input from 'cozy-ui/transpiled/react/Input'
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import Label from 'cozy-ui/transpiled/react/Label'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { translate, useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import AppSections from 'cozy-ui/transpiled/react/AppSections'
import * as filterUtils from 'cozy-ui/transpiled/react/AppSections/search'

import flag from 'cozy-flags'
import StoreAppItem from './components/StoreAppItem'

const SearchField = ({ onChange, value }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const handleChange = useCallback(
    ev => {
      onChange(ev.target.value)
    },
    [onChange]
  )
  return (
    <>
      {!isMobile ? (
        <Label className="u-di u-mr-half" htmlFor="discover-search">
          {t('discover-search-field.label')}
        </Label>
      ) : null}
      <InputGroup
        className={isMobile ? '' : 'u-mb-1'}
        prepend={
          isMobile ? (
            <Icon icon="magnifier" className="u-pl-1 u-coolGrey" />
          ) : null
        }
      >
        <Input
          id="discover-search"
          placeholder={t('discover-search-field.placeholder')}
          onChange={handleChange}
          type="text"
          value={value}
        />
      </InputGroup>
    </>
  )
}

const SearchResults = ({ searchResults, onAppClick }) => {
  const sortedSortResults = useMemo(() => {
    return sortBy(searchResults, result => result.score)
  }, [searchResults])
  return (
    <div className="u-mv-1 u-flex u-flex-wrap">
      {sortedSortResults.map(result => {
        const app = result.item
        return (
          <StoreAppItem
            onClick={() => onAppClick(app.slug)}
            key={app.slug}
            app={app}
          />
        )
      })}
    </div>
  )
}

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
      filter: {},
      searchFieldValue: '',
      filteredApps: this.getFilteredApps()
    }
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
      keys: [
        'name',
        'categories',
        `locales.${lang}.short_description`,
        `locales.${lang}.long_description`,
        'doctypes'
      ]
    }

    const { filteredApps } = this.state

    const appsForSearch = filteredApps.map(app => ({
      ...app,
      doctypes: Object.values(app.permissions).map(x => x.type)
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
