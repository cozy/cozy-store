'use strict'

/* eslint-env jest */

import {
  getAppBySlug,
  getInstalledApps,
  getRegistryApps
} from 'ducks/apps/selectors'
import mockApps from './_mockApps'

const mockInstalledApps = mockApps.filter(a => a.installed)
const mockRegistryApps = mockApps.filter(a => a.isInRegistry)

describe('Apps ducks selectors', () => {
  const state = { apps: { list: mockApps } }
  it('getAppBySlug', () => {
    expect(getAppBySlug(state, 'collect')).toEqual(
      mockApps.find(a => a.slug === 'collect')
    )
  })
  it('getInstalledApps', () => {
    expect(getInstalledApps(state)).toEqual(mockInstalledApps)
  })
  it('getRegistryApps', () => {
    expect(getRegistryApps(state)).toEqual(mockRegistryApps)
  })
})
