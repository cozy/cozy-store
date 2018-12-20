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

  it('should filter correctly on pending update apps', () => {
    expect(
      getFilteredAppsFromSearch(mockApps, '?pendingUpdate=true')
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

  it('should not throw error if search is not provided', () => {
    expect(getFilteredAppsFromSearch(mockApps)).toMatchSnapshot()
  })

  it('should not throw error if app with malformed permission and search on doctype', () => {
    const malFormedPermApp = {
      slug: 'collect',
      name: 'Collect',
      editor: 'Cozy',
      name_prefix: 'Cozy',
      categories: ['cozy'],
      developer: { name: 'Cozy' },
      type: 'webapp',
      icon: '<svg></svg>',
      permissions: {
        mock: {
          // NO TYPE = malformed
          description: 'io.mock.doctype'
        },
        mock2: {
          type: 'io.mock.doctype2'
        }
      },
      tags: ['konnector', 'collect', 'bills', 'providers', 'files'],
      version: '3.0.0',
      versions: {
        stable: ['3.0.0'],
        beta: ['3.0.0'],
        dev: ['3.0.0']
      },
      uninstallable: false,
      installed: true,
      isInRegistry: true,
      related: 'http://collect.cozy.mock/'
    }
    expect(
      getFilteredAppsFromSearch([malFormedPermApp], '?doctype=io.mock.doctype')
    ).toMatchSnapshot()
  })

  it('should not throw error if app with no categories and search on category', () => {
    const appWithoutCategories = {
      slug: 'collect',
      name: 'Collect',
      editor: 'Cozy',
      name_prefix: 'Cozy',
      developer: { name: 'Cozy' },
      type: 'webapp',
      icon: '<svg></svg>',
      permissions: {
        mock: {
          type: 'io.mock.doctype'
        },
        mock2: {
          type: 'io.mock.doctype2'
        }
      },
      tags: ['konnector', 'collect', 'bills', 'providers', 'files'],
      version: '3.0.0',
      versions: {
        stable: ['3.0.0'],
        beta: ['3.0.0'],
        dev: ['3.0.0']
      },
      uninstallable: false,
      installed: true,
      isInRegistry: true,
      related: 'http://collect.cozy.mock/'
    }
    expect(
      getFilteredAppsFromSearch([appWithoutCategories], '?category=cozy')
    ).toMatchSnapshot()
  })
})
