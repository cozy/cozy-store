'use strict'

/* eslint-env jest */
/* global cozy */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { version, isFetching, error, fetchLastAppVersion } from '../../../../src/ducks/apps/currentAppVersion'
import mockAppVersion from '../_mockAppRegistryVersion'

import {
  UnavailableRegistryException,
  NotFoundException
} from '../../../../src/lib/exceptions'

const mockError = new UnavailableRegistryException()
const mockNotFoundError = new NotFoundException()

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const fetchVersionAction = {
  type: 'FETCH_APP_VERSION'
}

const fetchVersionSuccessAction = {
  version: mockAppVersion,
  type: 'FETCH_APP_VERSION_SUCCESS'
}

const fetchVersionErrorAction = {
  error: mockError,
  type: 'FETCH_APP_VERSION_FAILURE'
}

const fetchVersionNotFoundErrorAction = {
  error: mockNotFoundError,
  type: 'FETCH_APP_VERSION_FAILURE'
}

describe('CurrenAppVersion ducks reducers', () => {
  it('version', () => {
    expect(version(null, fetchVersionSuccessAction)).toBe(mockAppVersion)
    expect(version(null, fetchVersionAction)).toBe(null)
    expect(version(null, fetchVersionErrorAction)).toBe(null)
  })

  it('isFetching', () => {
    expect(isFetching(null, fetchVersionSuccessAction)).toBe(false)
    expect(isFetching(null, fetchVersionAction)).toBe(true)
    expect(isFetching(null, fetchVersionErrorAction)).toBe(false)
  })

  it('error', () => {
    expect(error(null, fetchVersionSuccessAction)).toBe(null)
    expect(error(null, fetchVersionAction)).toBe(null)
    expect(error(null, fetchVersionErrorAction)).toBe(mockError)
  })
})

describe('CurrenAppVersion ducks actions', () => {
  beforeAll(() => {
    cozy.client = {
      fetchJSON: jest.fn()
      // first call return success fetched app version
      .mockImplementationOnce(() => {
        return new Promise(function (resolve, reject) {
          resolve(mockAppVersion)
        })
      })
      // second call return error when version fetching failure
      .mockImplementationOnce(() => {
        return new Promise(function (resolve, reject) {
          reject(new Error('This is a test error for registry'))
        })
      })
      // third call return error when version not found
      .mockImplementationOnce(() => {
        return new Promise(function (resolve, reject) {
          const err = new Error('This is a test error for not found')
          err.status = 404
          reject(err)
        })
      })
    }
  })

  it('should correctly fetch the app version if success', () => {
    const expectedActions = [
      fetchVersionAction,
      fetchVersionSuccessAction
    ]
    const store = mockStore({})
    // stable channel by default
    return store.dispatch(fetchLastAppVersion('drive'))
      .then(() => {
        expect(cozy.client.fetchJSON.mock.calls.length).toBe(1)
        expect(cozy.client.fetchJSON.mock.calls[0][0]).toBe('GET')
        expect(cozy.client.fetchJSON.mock.calls[0][1]).toBe('/registry/drive/stable/latest')
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should correctly handle fetch error', () => {
    const expectedActions = [
      fetchVersionAction,
      fetchVersionErrorAction
    ]
    const store = mockStore({})
    // stable channel by default
    return store.dispatch(fetchLastAppVersion('drive'))
      .then(() => {
        expect(cozy.client.fetchJSON.mock.calls.length).toBe(2)
        expect(cozy.client.fetchJSON.mock.calls[0][0]).toBe('GET')
        expect(cozy.client.fetchJSON.mock.calls[0][1]).toBe('/registry/drive/stable/latest')
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should correctly handle when version not found', () => {
    const expectedActions = [
      fetchVersionAction,
      fetchVersionNotFoundErrorAction
    ]
    const store = mockStore({})
    // stable channel by default
    return store.dispatch(fetchLastAppVersion('drive'))
      .catch(() => {
        expect(cozy.client.fetchJSON.mock.calls.length).toBe(3)
        expect(cozy.client.fetchJSON.mock.calls[0][0]).toBe('GET')
        expect(cozy.client.fetchJSON.mock.calls[0][1]).toBe('/registry/drive/stable/latest')
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
