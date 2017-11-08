'use strict'

/* eslint-env jest */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  list,
  isFetching,
  isInstalling,
  actionError,
  fetchError,
  getInstalledApps,
  getRegistryApps
} from 'ducks/apps'
import mockApps from './_mockApps'

import {
  NotUninstallableAppException
} from 'lib/exceptions'

const mockError = new Error('This is a test error')
const mockUninstallableError = new NotUninstallableAppException()

const mockInstalledApps = mockApps.filter(a => a.installed)
const mockRegistryApps = mockApps.filter(a => a.isInRegistry)

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const fetchAppsAction = {
  type: 'FETCH_APPS'
}

const fetchAppsSuccessAction = {
  apps: mockApps,
  type: 'FETCH_APPS_SUCCESS'
}

const fetchRegistryAppsSuccessAction = {
  apps: mockRegistryApps,
  type: 'FETCH_REGISTRY_APPS_SUCCESS'
}

const fetchAppsErrorAction = {
  error: mockError,
  type: 'FETCH_APPS_FAILURE'
}

const uninstallAppSuccessAction = {
  apps: mockApps,
  type: 'UNINSTALL_APP_SUCCESS'
}

const uninstallAppErrorAction = {
  error: mockError,
  type: 'UNINSTALL_APP_FAILURE'
}

const installAppAction = {
  type: 'INSTALL_APP'
}

const installAppSuccessAction = {
  apps: mockApps,
  type: 'INSTALL_APP_SUCCESS'
}

const installAppErrorAction = {
  error: mockError,
  type: 'INSTALL_APP_FAILURE'
}

describe('Apps ducks reducers', () => {
  it('list', () => {
    expect(list([], fetchAppsAction)).toEqual([])
    expect(list([], fetchAppsSuccessAction)).toEqual(mockApps)
    expect(list([], fetchRegistryAppsSuccessAction)).toEqual(mockRegistryApps)
    expect(list([], fetchAppsErrorAction)).toEqual([])
    expect(list([], installAppAction)).toEqual([])
    expect(list([], installAppErrorAction)).toEqual([])
    expect(list([], installAppSuccessAction)).toEqual(mockApps)
    expect(list([], uninstallAppSuccessAction)).toEqual(mockApps)
    expect(list([], uninstallAppErrorAction)).toEqual([])
    // with apps already in state, collect is installed and isInRegistry
    expect(list([{ slug: 'collect', name: 'Collect' }], fetchAppsSuccessAction)).toEqual(mockApps)
    expect(list([{ slug: 'collect', name: 'Collect' }], fetchRegistryAppsSuccessAction)).toEqual(mockRegistryApps)
  })

  it('isFetching', () => {
    expect(isFetching(false, fetchAppsAction)).toBe(true)
    expect(isFetching(true, fetchAppsSuccessAction)).toBe(false)
    // registry fetching is followed by installed apps fetching, so still true
    expect(isFetching(true, fetchRegistryAppsSuccessAction)).toBe(true)
    expect(isFetching(true, fetchAppsErrorAction)).toBe(false)
    expect(isFetching(false, installAppAction)).toBe(false)
    expect(isFetching(false, installAppErrorAction)).toBe(false)
    expect(isFetching(false, installAppSuccessAction)).toBe(false)
    expect(isFetching(false, uninstallAppSuccessAction)).toBe(false)
    expect(isFetching(false, uninstallAppErrorAction)).toBe(false)
  })

  it('isInstalling', () => {
    expect(isInstalling(false, fetchAppsAction)).toBe(false)
    expect(isInstalling(false, fetchAppsSuccessAction)).toBe(false)
    expect(isInstalling(false, fetchRegistryAppsSuccessAction)).toBe(false)
    expect(isInstalling(false, fetchAppsErrorAction)).toBe(false)
    expect(isInstalling(false, installAppAction)).toBe(true)
    expect(isInstalling(true, installAppErrorAction)).toBe(false)
    expect(isInstalling(true, installAppSuccessAction)).toBe(false)
    expect(isInstalling(false, uninstallAppSuccessAction)).toBe(false)
    expect(isInstalling(false, uninstallAppErrorAction)).toBe(false)
  })

  it('actionError', () => {
    expect(actionError(null, fetchAppsAction)).toBe(null)
    expect(actionError(null, fetchAppsSuccessAction)).toBe(null)
    expect(actionError(null, fetchRegistryAppsSuccessAction)).toBe(null)
    expect(actionError(null, fetchAppsErrorAction)).toBe(null)
    expect(actionError(null, installAppAction)).toBe(null)
    expect(actionError(null, installAppErrorAction)).toBe(mockError)
    expect(actionError(null, installAppSuccessAction)).toBe(null)
    expect(actionError(null, uninstallAppSuccessAction)).toBe(null)
    expect(actionError(null, uninstallAppErrorAction)).toBe(mockError)
  })

  it('fetchError', () => {
    expect(fetchError(null, fetchAppsAction)).toBe(null)
    expect(fetchError(null, fetchAppsSuccessAction)).toBe(null)
    expect(fetchError(null, fetchRegistryAppsSuccessAction)).toBe(null)
    expect(fetchError(null, fetchAppsErrorAction)).toBe(mockError)
    expect(fetchError(null, installAppAction)).toBe(null)
    expect(fetchError(null, installAppErrorAction)).toBe(null)
    expect(fetchError(null, installAppSuccessAction)).toBe(null)
    expect(fetchError(null, uninstallAppSuccessAction)).toBe(null)
    expect(fetchError(null, uninstallAppErrorAction)).toBe(null)
  })
})

describe('Apps ducks selectors', () => {
  const state = { apps: { list: mockApps } }
  it('getInstalledApps', () => {
    expect(getInstalledApps(state)).toEqual(mockInstalledApps)
  })
  it('getRegistryApps', () => {
    expect(getRegistryApps(state)).toEqual(mockRegistryApps)
  })
})
