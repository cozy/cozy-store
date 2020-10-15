import React, { useCallback, useMemo } from 'react'
import sortBy from 'lodash/sortBy'

import Icon from 'cozy-ui/transpiled/react/Icon'
import Label from 'cozy-ui/transpiled/react/Label'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import Input from 'cozy-ui/transpiled/react/Input'

import flag from 'cozy-flags'

import StoreAppItem from 'ducks/apps/components/StoreAppItem'

import { dumpMatches } from 'ducks/search/utils'

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

export const SearchResults = ({ searchResults, onAppClick }) => {
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
              onClick={() => dumpMatches(result)}
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
