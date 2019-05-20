'use strict'

/* eslint-env jest */

import matcherFromSearch from 'lib/matcherFromSearch'
import mockApps from '../ducks/apps/_mockApps'

describe('matcherFromSearch library', () => {
  it('should filter correctly on type', () => {
    const matcher = matcherFromSearch({ type: 'webapp' })
    expect(mockApps.filter(matcher)).toMatchSnapshot()
  })

  it('should filter correctly on doctype', () => {
    const matcher = matcherFromSearch({ doctype: 'io.mock.doctype2' })
    expect(mockApps.filter(matcher)).toMatchSnapshot()
  })

  it('should filter correctly on tags', () => {
    const matcher = matcherFromSearch({ tag: 'bills' })
    expect(mockApps.filter(matcher)).toMatchSnapshot()
  })

  it('should filter correctly on category', () => {
    const matcher = matcherFromSearch({ category: 'cozy' })
    expect(mockApps.filter(matcher)).toMatchSnapshot()
  })

  it('should filter correctly on pending update apps', () => {
    const matcher = matcherFromSearch({ pendingUpdate: true })
    expect(mockApps.filter(matcher)).toMatchSnapshot()
  })

  it('should handle correctly multi filters', () => {
    const matcher = matcherFromSearch({
      type: 'konnector',
      doctype: 'io.mock.doctype'
    })
    expect(mockApps.filter(matcher)).toMatchSnapshot()
  })

  it('should not throw error if search is not provided', () => {
    const matcher = matcherFromSearch()
    expect(mockApps.filter(matcher)).toMatchSnapshot()
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
    const matcher = matcherFromSearch({ doctype: 'io.mock.doctype' })
    expect([malFormedPermApp].filter(matcher)).toMatchSnapshot()
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
    const matcher = matcherFromSearch({ category: 'cozy' })
    expect([appWithoutCategories].filter(matcher)).toMatchSnapshot()
  })
})
