'use strict'

document.body.innerHTML =
  '<div role="application" data-cozy-domain="cozy.tools" />'
window.location.protocol = 'http:'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { combineReducers } from 'redux'

import {
  initApp,
  initAppIntent,
  getAppIconProps,
  getContext,
  _getRegistryAssetsLinks,
  _sanitizeCategories,
  _sanitizeManifest
} from 'ducks/apps'
import { appsReducers } from 'ducks/apps/reducers'
import _mockRegistryAppsResponse from './_mockRegistryAppsResponse'

const mockStore = configureStore([thunk])
const storeReducers = combineReducers({
  apps: appsReducers
})
const storeInitialeState = storeReducers({ apps: {} })

describe('Apps duck actions', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    global.cozy.client = {
      _token: {
        token: '_tOkEn_test_'
      },
      _url: '//cozy.tools',
      fetchJSON: jest.fn(() => Promise.resolve())
    }
  })

  it('getAppIconProps should return correct icon props for <AppIcon /> component', () => {
    expect(getAppIconProps()).toMatchSnapshot()
  })

  it('initApp initialize realtime and fetch all apps', async () => {
    global.cozy.client.fetchJSON = jest.fn((method, url) => {
      if (url.match(/\/registry/))
        return Promise.resolve(_mockRegistryAppsResponse)
      if (url.match(/\/apps/)) return Promise.resolve([])
      if (url.match(/\/konnectors/)) return Promise.resolve([])
    })
    const store = mockStore(storeInitialeState)
    await store.dispatch(initApp('en'))
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
  })

  it('initAppIntent initialize realtime and fetch asked installed app', async () => {
    const testSlug = 'collect'
    global.cozy.client.fetchJSON = jest.fn((method, url) => {
      if (url.match(/\/registry/))
        return Promise.resolve(
          _mockRegistryAppsResponse.data.find(a => a.slug === testSlug)
        )
      if (url.match(/\/apps/)) return Promise.resolve([{ slug: 'collect' }])
      if (url.match(/\/konnectors/))
        return Promise.reject(new Error('Mock error'))
    })
    // we have to manually update the store state
    const storeState = {
      apps: Object.assign({}, storeInitialeState.apps, {
        isAppFetching: true
      })
    }
    const store = mockStore(storeState)
    await store.dispatch(initAppIntent('en', testSlug))
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
  })

  it('initAppIntent initialize realtime and fetch asked not installed konnector', async () => {
    const testSlug = 'konnector-bouilligue'
    global.cozy.client.fetchJSON = jest.fn((method, url) => {
      if (url.match(/\/registry/))
        return Promise.resolve(
          _mockRegistryAppsResponse.data.find(a => a.slug === testSlug)
        )
      if (url.match(/\/apps/)) return Promise.resolve([{ slug: 'collect' }])
      if (url.match(/\/konnectors/))
        return Promise.reject(new Error('Mock error'))
    })
    // we have to manually update the store state
    const storeState = {
      apps: Object.assign({}, storeInitialeState.apps, {
        isAppFetching: true
      })
    }
    const store = mockStore(storeState)
    await store.dispatch(initAppIntent('en', testSlug))
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
  })

  describe('getContext function', () => {
    beforeEach(() => {
      jest.resetModules()
      jest.resetAllMocks()
    })
    it('should catch fetch error and not throw error', async () => {
      // we require to reset the global storage variable
      global.cozy.client.fetchJSON = jest.fn((method, url) => {
        if (url === '/settings/context')
          return Promise.reject(new Error('A mock error'))
      })
      expect(await getContext()).toStrictEqual({})
      expect(global.cozy.client.fetchJSON.mock.calls.length).toBe(1)
    })
    it('should return empty object if 404 and fetch only once', async () => {
      // we require to reset the global storage variable
      const getContext = require('ducks/apps').getContext
      global.cozy.client.fetchJSON = jest.fn((method, url) => {
        if (url === '/settings/context') return Promise.reject({ status: 404 })
      })
      expect(await getContext()).toStrictEqual({})
      expect(await getContext()).toStrictEqual({})
      expect(global.cozy.client.fetchJSON.mock.calls.length).toBe(1)
    })
    it('should fetch correctly the context through the client and fetch only once', async () => {
      // we require to reset the global storage variable
      const getContext = require('ducks/apps').getContext
      const mockContext = { contextData: 'mock' }
      global.cozy.client.fetchJSON = jest.fn((method, url) => {
        if (url === '/settings/context') return Promise.resolve(mockContext)
      })
      expect(await getContext()).toStrictEqual(mockContext)
      expect(await getContext()).toStrictEqual(mockContext)
      expect(global.cozy.client.fetchJSON.mock.calls.length).toBe(1)
    })
  })
})

describe('Apps duck helpers', () => {
  describe('_sanitizeCategories', () => {
    it('should return the list of the provided expected categories correctly', () => {
      // all of these categories is authorized by config/categories.json
      // so it won't be filtered
      const categories = [
        'cozy',
        'isp',
        'partners',
        'press',
        'shopping',
        'telecom'
      ]
      expect(_sanitizeCategories(categories)).toEqual(categories)
    })
    it('should filter unwanted categories', () => {
      // pressingggg is not allowed as category
      const categories = [
        'cozy',
        'isp',
        'partners',
        'pressingggg',
        'shopping',
        'telecom'
      ]
      expect(_sanitizeCategories(categories)).toEqual(
        categories.filter(c => c !== 'pressingggg')
      )
    })
    it('should return "others" as category if no categories provided', () => {
      expect(_sanitizeCategories([])).toEqual(['others'])
      expect(_sanitizeCategories(null)).toEqual(['others'])
    })
    it('should return "others" as category if categories after filtering is empty', () => {
      // pressingggg is not allowed as category
      expect(_sanitizeCategories(['pressingggg'])).toEqual(['others'])
    })
  })

  describe('_sanitizeManifest', () => {
    it('should handle legacy category property', () => {
      const testCategory = 'shop bling'
      expect(
        _sanitizeManifest({ slug: 'mock', category: testCategory })
      ).toStrictEqual({
        slug: 'mock',
        categories: [testCategory]
      })
    })
    it('should handle legacy name property locales ("en" only)', () => {
      const testName = 'Mock'
      expect(
        _sanitizeManifest({
          slug: 'mock',
          name: {
            en: testName
          }
        })
      ).toStrictEqual({
        slug: 'mock',
        name: testName
      })
    })
    it('should transform available_version property to availableVersion of provided', () => {
      const testVersion = '3.0.0'
      expect(
        _sanitizeManifest({
          slug: 'mock',
          available_version: testVersion
        })
      ).toStrictEqual({
        slug: 'mock',
        availableVersion: testVersion
      })
    })
    it('should remove incomplete or empty terms and keep complete terms', () => {
      const incompleteTerms = {
        id: 'mock-terms'
      }
      const completeTerms = {
        id: 'mock-terms',
        url: 'mock://terms',
        version: 'mock001'
      }
      expect(
        _sanitizeManifest({
          slug: 'mock',
          terms: {}
        })
      ).toStrictEqual({
        slug: 'mock'
      })
      expect(
        _sanitizeManifest({
          slug: 'mock',
          terms: incompleteTerms
        })
      ).toStrictEqual({
        slug: 'mock'
      })
      expect(
        _sanitizeManifest({
          slug: 'mock',
          terms: completeTerms
        })
      ).toStrictEqual({
        slug: 'mock',
        terms: completeTerms
      })
    })
    it('should remove incomplete or empty partnership and keep complete partnership', () => {
      const incompletePartnership = {
        icon: 'icon.svg' // icon is optional
      }
      const completePartnership = {
        description: 'A partnership text here' // description is mandatory
      }
      expect(
        _sanitizeManifest({
          slug: 'mock',
          partnership: {}
        })
      ).toStrictEqual({
        slug: 'mock'
      })
      expect(
        _sanitizeManifest({
          slug: 'mock',
          partnership: incompletePartnership
        })
      ).toStrictEqual({
        slug: 'mock'
      })
      expect(
        _sanitizeManifest({
          slug: 'mock',
          partnership: completePartnership
        })
      ).toStrictEqual({
        slug: 'mock',
        partnership: completePartnership
      })
    })
  })

  describe('_getRegistryAssetsLinks', () => {
    it('should handle empty manifest or appVersion', () => {
      expect(_getRegistryAssetsLinks({})).toStrictEqual({})
      expect(_getRegistryAssetsLinks()).toStrictEqual({})
      expect(_getRegistryAssetsLinks({}, '1.0.0')).toMatchSnapshot()
    })
    it('should handle icon link from manifest slug and version', () => {
      expect(
        _getRegistryAssetsLinks({ slug: 'mock' }, '1.0.0')
      ).toMatchSnapshot()
    })
    it('should handle screenshots links', () => {
      expect(
        _getRegistryAssetsLinks(
          {
            slug: 'mock',
            screenshots: ['screen1.jpg', 'screen2.png', '/screen3.gif']
          },
          '1.0.0'
        )
      ).toMatchSnapshot()
    })
    it('should handle partnership icon link', () => {
      expect(
        _getRegistryAssetsLinks(
          {
            slug: 'mock',
            partnership: {
              description: 'a text here',
              icon: 'partnershipIcon.svg'
            }
          },
          '1.0.0'
        )
      ).toMatchSnapshot()
    })
  })
})
