import React, { Component, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import sortBy from 'lodash/sortBy'
import debounce from 'lodash/debounce'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Field from 'cozy-ui/transpiled/react/Field'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import AppSections from 'cozy-ui/transpiled/react/AppSections'
import DropdownFilter from './components/DropdownFilter'
import StoreAppItem from './components/StoreAppItem'

import * as searchUtils from './search'
import * as catUtils from './categories'

const SearchField = ({ onChange }) => {
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
      search: {},
      searchFieldValue: '',
      filteredApps: this.getFilteredApps()
    }
    this.setupFuse()
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleChangeSearchFieldChange = debounce(
      this.handleChangeSearchFieldChange.bind(this),
      500
    )
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

    const { apps } = this.props

    const appsForSearch = apps.map(app => ({
      ...app,
      doctypes: Object.values(app.permissions).map(x => x.type)
    }))
    this.fuse = new Fuse(appsForSearch, options)
  }

  /** Rename as filter */
  getSearch() {
    // Depending on whether the component is controlled or uncontrolled,
    // search is taken from props or state
    const search = this.props.search || this.state.search
    return search
  }

  getFilteredApps() {
    const search = this.getSearch()
    const searchMatcher = searchUtils.makeMatcherFromSearch(search)
    const filteredApps = this.props.apps.filter(searchMatcher)
    return filteredApps
  }

  handleChangeSearchFieldChange(searchFieldValue) {
    const searchResults = searchFieldValue
      ? this.fuse.search(searchFieldValue)
      : null
    this.setState({
      searchFieldValue,
      searchResults: searchResults ? searchResults : null
    })
  }

  // Sets state.search from the option received from the DropdownFilter
  handleCategoryChange(categoryOption) {
    const search = searchUtils.makeSearchFromOption(categoryOption)
    if (!this.props.search) {
      // the component is uncontrolled
      this.setState({
        search
      })
    }
    if (typeof this.props.onSearchChange === 'function') {
      this.props.onSearchChange(search)
    }

    this.setupFuse()
  }

  render() {
    const { t, apps, error, onAppClick, breakpoints = {}, hasNav } = this.props
    const search = this.getSearch()
    const { isMobile, isTablet } = breakpoints
    const { filteredApps, searchResults } = this.state

    if (error) return <p className="u-error">{error.message}</p>

    const dropdownDisplayed = hasNav && (isMobile || isTablet)
    const rawSelectOptions = catUtils.generateOptionsFromApps(apps, {
      includeAll: true
    })
    const selectOptions = rawSelectOptions.map(option =>
      catUtils.addLabel(option, t)
    )
    const optionMatcher = searchUtils.makeOptionMatcherFromSearch(search)
    const defaultFilterValue = selectOptions.find(optionMatcher)

    return (
      <div className={`sto-sections${dropdownDisplayed ? '' : ' u-mt-half'}`}>
        <SearchField
          value={search}
          onChange={this.handleChangeSearchFieldChange}
        />
        {dropdownDisplayed && (
          <DropdownFilter
            defaultValue={defaultFilterValue}
            options={selectOptions}
            onChange={this.handleCategoryChange}
          />
        )}
        {searchResults ? (
          <SearchResults
            searchResults={searchResults}
            onAppClick={onAppClick}
          />
        ) : (
          <AppSections apps={filteredApps} onAppClick={onAppClick} />
        )}
      </div>
    )
  }
}

Sections.propTypes = {
  t: PropTypes.func.isRequired,
  apps: PropTypes.array.isRequired,
  error: PropTypes.object,
  onAppClick: PropTypes.func.isRequired,
  hasNav: PropTypes.bool
}

Sections.defaultProps = {
  hasNav: true
}

export default translate()(withBreakpoints()(Sections))
