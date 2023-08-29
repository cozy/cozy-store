import StoreAppItem from 'ducks/apps/components/StoreAppItem'
import { dumpMatches } from 'ducks/search/utils'
import sortBy from 'lodash/sortBy'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'

import flag from 'cozy-flags'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'
import Input from 'cozy-ui/transpiled/react/Input'
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import Label from 'cozy-ui/transpiled/react/Label'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

export const SearchField = ({ onChange, value }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const handleChange = useCallback(
    ev => {
      onChange(ev.target.value)
    },
    [onChange]
  )
  return (
    <div className="u-flex u-flex-items-center u-flex-grow-1">
      {!isMobile ? (
        <Label className="u-di u-mr-half" htmlFor="discover-search">
          {t('discover-search-field.label')}
        </Label>
      ) : null}
      <InputGroup
        prepend={
          isMobile ? (
            <Icon icon={Magnifier} className="u-pl-1 u-coolGrey" />
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
    </div>
  )
}

export const SearchResults = ({ searchResults, onAppClick, disableClick }) => {
  const sortedSortResults = useMemo(() => {
    return sortBy(searchResults, result => result.score)
  }, [searchResults])
  return (
    <div className="u-mv-1 u-flex u-flex-wrap">
      {sortedSortResults.map(result => {
        const app = result.item
        const isDisableClick = disableClick?.(app)
        return flag('store.show-search-score') ? (
          <div>
            <StoreAppItem
              onClick={() => !isDisableClick && onAppClick(app.slug)}
              key={app.slug}
              app={app}
            />
            <small
              onClick={() => dumpMatches(result)}
              title={JSON.stringify(result.matches, null, 2)}
            >
              {result.score.toFixed(2)}
            </small>
          </div>
        ) : (
          <StoreAppItem
            onClick={() => !isDisableClick && onAppClick(app.slug)}
            key={app.slug}
            app={app}
          />
        )
      })}
    </div>
  )
}

SearchResults.propTypes = {
  onAppClick: PropTypes.func.isRequired,
  disableClick: PropTypes.func,
  searchResults: PropTypes.array
}
