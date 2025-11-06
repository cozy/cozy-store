'use strict'

document.body.innerHTML =
  '<div role="application" data-cozy=\'{"domain": "cozy.tools"}\' />'
window.location.protocol = 'http:'

import { combineReducers } from 'redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import CozyClient from 'cozy-client'
import StackClient from 'cozy-stack-client'

import _mockRegistryAppsResponse from './_mockRegistryAppsResponse'

import {
  initApp,
  initAppIntent,
  getAppIconProps,
  getContext,
  _getRegistryAssetsLinks,
  _sanitizeCategories,
  _sanitizeManifest
} from '@/ducks/apps'
import { appsReducers } from '@/ducks/apps/reducers'

const mockStore = configureStore([thunk])
const storeReducers = combineReducers({
  apps: appsReducers
})
const storeInitialeState = storeReducers({ apps: {} })

describe('Apps duck actions', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  let cozyClient
  beforeEach(() => {
    cozyClient = new CozyClient({
      uri: 'https://testcozy.mycozy.cloud',
      token: 'test-token'
    })
  })

  const rejectOrResolve = value => {
    if (value instanceof Error) {
      return Promise.reject(value)
    } else {
      return Promise.resolve(value)
    }
  }

  const setupClient = ({
    registry = [],
    apps = { data: [] },
    konnectors = { data: [] }
  }) => {
    StackClient.prototype.fetchJSON = jest.fn((method, url) => {
      if (url.match(/\/registry/)) return rejectOrResolve(registry)
      if (url.match(/\/apps/)) return rejectOrResolve(apps)
      if (url.match(/\/konnectors/)) return rejectOrResolve(konnectors)
    })
  }

  it('getAppIconProps should return correct icon props for <AppIcon /> component', () => {
    expect(getAppIconProps()).toMatchSnapshot()
  })

  it('initApp initialize realtime and fetch all apps', async () => {
    setupClient({
      registry: _mockRegistryAppsResponse
    })

    const store = mockStore(storeInitialeState)
    await store.dispatch(initApp(cozyClient, 'en'))
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
  })

  it('initAppIntent initialize realtime and fetch asked installed app', async () => {
    const testSlug = 'collect'
    setupClient({
      registry: _mockRegistryAppsResponse.data.find(a => a.slug === testSlug),
      apps: { data: [{ slug: 'collect' }] },
      konnectors: new Error('Mock error')
    })
    // we have to manually update the store state
    const storeState = {
      apps: Object.assign({}, storeInitialeState.apps, {
        isAppFetching: true
      })
    }
    const store = mockStore(storeState)
    await store.dispatch(initAppIntent(cozyClient, 'en', testSlug))
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
  })

  it('initAppIntent initialize realtime and fetch asked not installed konnector', async () => {
    const testSlug = 'konnector-bouilligue'
    setupClient({
      registry: _mockRegistryAppsResponse.data.find(a => a.slug === testSlug),
      apps: { data: [{ slug: 'collect' }] },
      konnectors: new Error('Mock error')
    })
    // we have to manually update the store state
    const storeState = {
      apps: Object.assign({}, storeInitialeState.apps, {
        isAppFetching: true
      })
    }
    const store = mockStore(storeState)
    await store.dispatch(initAppIntent(cozyClient, 'en', testSlug))
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
  })

  describe('getContext function', () => {
    beforeEach(() => {
      jest.resetModules()
      jest.resetAllMocks()
    })

    let contextResp
    beforeEach(() => {
      StackClient.prototype.fetchJSON = jest.fn((method, url) => {
        if (url === '/settings/context') return rejectOrResolve(contextResp)
      })
      getContext.clearCache()
    })

    it('should catch fetch error and not throw error', async () => {
      contextResp = new Error('A mock error')
      expect(await getContext(cozyClient)).toStrictEqual({})
      expect(StackClient.prototype.fetchJSON).toHaveBeenCalledTimes(1)
    })
    it('should return empty object if 404 and fetch only once', async () => {
      const err404 = new Error('Not found')
      err404.status = 404
      contextResp = err404
      expect(await getContext(cozyClient)).toStrictEqual({})
      expect(await getContext(cozyClient)).toStrictEqual({})
      expect(StackClient.prototype.fetchJSON).toHaveBeenCalledTimes(1)
    })
    it('should fetch correctly the context through the client and fetch only once', async () => {
      contextResp = { contextData: 'mock' }
      expect(await getContext(cozyClient)).toStrictEqual(contextResp)
      expect(await getContext(cozyClient)).toStrictEqual(contextResp)
      expect(StackClient.prototype.fetchJSON).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Apps duck helpers', () => {
  let cozyClient
  beforeEach(() => {
    cozyClient = new CozyClient({
      uri: 'https://testcozy.mycozy.cloud',
      token: 'test-token'
    })
  })

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
      expect(_getRegistryAssetsLinks(cozyClient, {})).toStrictEqual({})
      expect(_getRegistryAssetsLinks(cozyClient)).toStrictEqual({})
      expect(_getRegistryAssetsLinks(cozyClient, {}, '1.0.0')).toMatchSnapshot()
    })
    it('should handle icon link from manifest slug and version', () => {
      expect(
        _getRegistryAssetsLinks(cozyClient, { slug: 'mock' }, '1.0.0')
      ).toMatchSnapshot()
    })
    it('should handle screenshots links', () => {
      expect(
        _getRegistryAssetsLinks(
          cozyClient,
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
          cozyClient,
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
