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

const fillIndices = (str, indices) => {
  let cur = 0
  let res = []
  for (let idx of indices) {
    if (idx[0] != cur) {
      res.push({ idx: [cur, idx[0]], mark: false })
    }
    res.push({ idx, mark: true })
    cur = idx[1]
  }
  if (cur != str.length) {
    res.push({ idx: [cur, str.length], mark: false })
  }

  return res
}

const dumpmatches = result => {
  for (let m of result.matches) {
    const allindices = fillIndices(m.value, m.indices)
    // eslint-disable-next-line no-console
    console.log(
      allindices
        .map(o => {
          const [start, end] = o.idx
          const substr = m.value.substring(start, end)
          return o.mark ? `**${substr}**` : substr
        })
        .join('')
    )
  }
}

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
        return flag('store.show-search-score') ? (
          <div>
            <StoreAppItem
              onClick={() => onAppClick(app.slug)}
              key={app.slug}
              app={app}
            />
            <small
              onClick={() => dumpmatches(result)}
              title={JSON.stringify(result.matches, null, 2)}
            >
              {result.score.toFixed(2)}
            </small>
          </div>
        ) : (
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
      distance: 10,
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
