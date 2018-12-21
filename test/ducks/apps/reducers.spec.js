'use strict'

/* eslint-env jest */

import _get from 'lodash.get'

import {
  LOADING_APP,
  LOADING_APP_INTENT,
  FETCH_APPS,
  FETCH_APPS_SUCCESS,
  FETCH_APPS_FAILURE,
  FETCH_APP,
  FETCH_APP_SUCCESS,
  FETCH_APP_FAILURE,
  FETCH_REGISTRY_APPS_SUCCESS,
  UNINSTALL_APP,
  UNINSTALL_APP_SUCCESS,
  UNINSTALL_APP_FAILURE,
  INSTALL_APP,
  INSTALL_APP_SUCCESS,
  INSTALL_APP_FAILURE,
  list,
  isFetching,
  isAppFetching,
  isInstalling,
  isUninstalling,
  actionError,
  fetchError
} from 'ducks/apps/reducers'
import mockApps from './_mockApps'
import mockApp from './_mockPhotosRegistryVersion'

const mockError = new Error('This is a test error')

const mockRegistryApps = mockApps.filter(a => a.isInRegistry)
const mockAppAlone = [mockApp]

const reducersMap = new Map([
  ['list', list],
  ['isFetching', isFetching],
  ['isAppFetching', isAppFetching],
  ['isInstalling', isInstalling],
  ['isUninstalling', isUninstalling],
  ['actionError', actionError],
  ['fetchError', fetchError]
])

const actionsMap = new Map([
  [
    'FETCH_APPS*',
    {
      fetchAppsAction: { type: FETCH_APPS },
      fetchAppsSuccessAction: {
        apps: mockApps,
        type: FETCH_APPS_SUCCESS
      },
      fetchAppsErrorAction: {
        error: mockError,
        type: FETCH_APPS_FAILURE
      }
    }
  ],
  [
    'FETCH_REGISTRY_APPS*',
    {
      fetchRegistryAppsSuccessAction: {
        apps: mockRegistryApps,
        type: FETCH_REGISTRY_APPS_SUCCESS
      }
    }
  ],
  [
    'FETCH_APP*',
    {
      fetchAppAction: { type: FETCH_APP },
      fetchAppSuccessAction: {
        apps: mockAppAlone,
        type: FETCH_APP_SUCCESS
      },
      fetchAppErrorAction: {
        error: mockError,
        type: FETCH_APP_FAILURE
      }
    }
  ],
  [
    'INSTALL_APP*',
    {
      installAppAction: { type: INSTALL_APP },
      installAppSuccessAction: {
        installedApp: mockApp,
        type: INSTALL_APP_SUCCESS
      },
      installAppErrorAction: {
        error: mockError,
        type: INSTALL_APP_FAILURE
      }
    }
  ],
  [
    'UNINSTALL_APP*',
    {
      uninstallAppAction: { type: UNINSTALL_APP },
      uninstallAppSuccessAction: {
        slug: 'collect',
        type: UNINSTALL_APP_SUCCESS
      },
      uninstallAppErrorAction: {
        error: mockError,
        type: UNINSTALL_APP_FAILURE
      }
    }
  ],
  [
    'LOADING_APP*',
    {
      loadingAppAction: { type: LOADING_APP },
      loadingAppIntentAction: { type: LOADING_APP_INTENT }
    }
  ]
])

/*
  each configuration line -> actionName: [input, assertPath, expectedResult]
  Missing action name property means that action doesn't touch the state
  for this reducer.
*/
const reducersTestConfig = {
  list: {
    installAppSuccessAction: [
      mockApps.map(a => {
        if (
          a.slug ==
          actionsMap.get('INSTALL_APP*').installAppSuccessAction.installedApp
            .slug
        )
          a.installed = false
        return a
      }),
      'toEqual',
      mockApps.map(a => {
        if (
          a.slug ==
          actionsMap.get('INSTALL_APP*').installAppSuccessAction.installedApp
            .slug
        )
          a.installed = true
        return a
      })
    ],
    uninstallAppSuccessAction: [
      mockApps.map(a => {
        if (
          a.slug ==
          actionsMap.get('UNINSTALL_APP*').uninstallAppSuccessAction.slug
        )
          a.installed = true
        return a
      }),
      'toEqual',
      mockApps.map(a => {
        if (
          a.slug ==
          actionsMap.get('UNINSTALL_APP*').uninstallAppSuccessAction.slug
        )
          a.installed = false
        return a
      })
    ],
    fetchAppsSuccessAction: [[], 'toEqual', mockApps],
    fetchRegistryAppsSuccessAction: [[], 'toEqual', mockRegistryApps],
    fetchAppSuccessAction: [[], 'toEqual', mockAppAlone]
  },
  isFetching: {
    loadingAppAction: [false, 'toBe', true],
    fetchAppsAction: [false, 'toBe', true],
    fetchAppsErrorAction: [true, 'toBe', false],
    fetchAppsSuccessAction: [true, 'toBe', false]
  },
  isAppFetching: {
    loadingAppIntentAction: [false, 'toBe', true],
    fetchAppAction: [false, 'toBe', true],
    fetchAppErrorAction: [true, 'toBe', false],
    fetchAppSuccessAction: [true, 'toBe', false]
  },
  isInstalling: {
    installAppAction: [false, 'toBe', true],
    installAppSuccessAction: [true, 'toBe', false],
    installAppErrorAction: [true, 'toBe', false]
  },
  isUninstalling: {
    uninstallAppAction: [false, 'toBe', true],
    uninstallAppSuccessAction: [true, 'toBe', false],
    uninstallAppErrorAction: [true, 'toBe', false]
  },
  actionError: {
    installAppSuccessAction: [mockError, 'toBe', null],
    installAppErrorAction: [null, 'toBe', mockError],
    uninstallAppSuccessAction: [mockError, 'toBe', null],
    uninstallAppErrorAction: [null, 'toBe', mockError]
  },
  fetchError: {
    fetchAppsSuccessAction: [mockError, 'toBe', null],
    fetchAppsErrorAction: [null, 'toBe', mockError],
    fetchAppSuccessAction: [mockError, 'toBe', null],
    fetchAppErrorAction: [null, 'toBe', mockError]
  }
}

describe('Apps ducks reducers', () => {
  function expectToNotTouchTheState(reducer, action) {
    expect(reducer('default_state', action)).toBe('default_state')
  }
  Object.keys(reducersTestConfig).map(reducerName => {
    // for each reducer from the config
    if (reducersTestConfig.hasOwnProperty(reducerName)) {
      describe(reducerName, () => {
        const reducerConfig = reducersTestConfig[reducerName]
        const reducer = reducersMap.get(reducerName)
        // we get all actions group defined in the actions Map
        actionsMap.forEach((actionsGroup, actionsGroupName) => {
          it(`- ${actionsGroupName}`, () => {
            beforeEach(() => {
              jest.resetAllMocks()
              jest.resetModules()
            })
            // we test all actions from the group
            Object.keys(actionsGroup).map(actionName => {
              const action = actionsGroup[actionName]
              // if defined in the reducer config, we use provided parameters
              if (reducerConfig.hasOwnProperty(actionName)) {
                const params = reducerConfig[actionName]
                _get(expect(reducer(params[0], action)), params[1])(params[2])
              } else {
                // not defined in the config, we guess that this is action
                // which doesn't change the reducer state here
                expectToNotTouchTheState(reducer, action)
              }
            })
          })
        })
      })
    }
  })
})
