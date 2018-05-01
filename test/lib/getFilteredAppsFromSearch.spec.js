'use strict'

/* eslint-env jest */

import getFilteredAppsFromSearch from 'lib/getFilteredAppsFromSearch'
import mockApps from '../ducks/apps/_mockApps'

describe('getFilteredAppsFromSearch library', () => {
  it('should filter correctly on type', () => {
    expect(
      getFilteredAppsFromSearch(mockApps, '?type=webapp')
    ).toMatchSnapshot()
  })

  it('should filter correctly on doctype', () => {
    expect(
      getFilteredAppsFromSearch(mockApps, '?doctype=io.mock.doctype2')
    ).toMatchSnapshot()
  })

  it('should filter correctly on tags', () => {
    expect(getFilteredAppsFromSearch(mockApps, '?tag=bills')).toMatchSnapshot()
  })

  it('should filter correctly on category', () => {
    expect(
      getFilteredAppsFromSearch(mockApps, '?category=cozy')
    ).toMatchSnapshot()
  })

  it('should handle correctly multi filters', () => {
    expect(
      getFilteredAppsFromSearch(
        mockApps,
        '?type=konnector&doctype=io.mock.doctype'
      )
    ).toMatchSnapshot()
  })
})
