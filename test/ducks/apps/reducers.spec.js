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
  RESTORE_APP,
  SAVE_APP,
  list,
  savedApp,
  isFetching,
  isAppFetching,
  isInstalling,
  isUninstalling,
  actionError,
  fetchError,
  _consolidateApps,
  _sortAlphabetically
} from 'ducks/apps/reducers'
import mockApps from './_mockApps'
import mockApp from './_mockPhotosRegistryVersion'

const mockError = new Error('This is a test error')

const mockAppAlone = [mockApp.manifest]

const reducersMap = new Map([
  ['list', list],
  ['savedApp', savedApp],
  ['isFetching', isFetching],
  ['isAppFetching', isAppFetching],
  ['isInstalling', isInstalling],
  ['isUninstalling', isUninstalling],
  ['actionError', actionError],
  ['fetchError', fetchError]
])

// to be sure we use cleaned mock apps list each time
const getMockApps = () => JSON.parse(JSON.stringify(mockApps))
const mockRegistryApps = getMockApps().filter(a => a.isInRegistry)

const actionsMap = new Map([
  [
    'FETCH_APPS*',
    {
      fetchAppsAction: { type: FETCH_APPS },
      fetchAppsSuccessAction: {
        apps: getMockApps(),
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
        app: mockAppAlone[0],
        type: FETCH_APP_SUCCESS
      },
      fetchAppErrorAction: {
        error: mockError,
        type: FETCH_APP_FAILURE
      }
    }
  ],
  [
    'SAVE/RESTORE_APP',
    {
      saveAppAction: { type: SAVE_APP, app: mockAppAlone[0] },
      saveMisformatedAppAction: { type: SAVE_APP, app: { slug: 'mismis' } },
      restoreAppAction: {
        app: mockAppAlone[0],
        type: RESTORE_APP
      },
      restoreMisformatedAppAction: {
        app: { slug: 'mismis' },
        type: RESTORE_APP
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
    installAppSuccessAction: {
      multiple: [
        [
          getMockApps().map(a => {
            if (
              a.slug ==
              actionsMap.get('INSTALL_APP*').installAppSuccessAction
                .installedApp.slug
            ) {
              a.installed = false
              if (a.availableVersion) delete a.availableVersion
            }
            return a
          }),
          'toEqual',
          getMockApps().map(a => {
            if (
              a.slug ==
              actionsMap.get('INSTALL_APP*').installAppSuccessAction
                .installedApp.slug
            )
              a.installed = true
            return a
          })
        ],
        // if available_version, this is an update
        [
          getMockApps().map(a => {
            if (
              a.slug ==
              actionsMap.get('INSTALL_APP*').installAppSuccessAction
                .installedApp.slug
            ) {
              a.installed = false
              a.availableVersion = '5.0.0'
            }
            return a
          }),
          'toEqual',
          getMockApps().map(a => {
            if (
              a.slug ==
              actionsMap.get('INSTALL_APP*').installAppSuccessAction
                .installedApp.slug
            )
              a.installed = true
            return a
          })
        ]
      ]
    },
    uninstallAppSuccessAction: [
      getMockApps().map(a => {
        if (
          a.slug ==
          actionsMap.get('UNINSTALL_APP*').uninstallAppSuccessAction.slug
        )
          a.installed = true
        return a
      }),
      'toEqual',
      getMockApps().map(a => {
        if (
          a.slug ==
          actionsMap.get('UNINSTALL_APP*').uninstallAppSuccessAction.slug
        )
          a.installed = false
        return a
      })
    ],
    fetchAppsSuccessAction: [[], 'toEqual', getMockApps()],
    fetchRegistryAppsSuccessAction: [[], 'toEqual', mockRegistryApps],
    fetchAppSuccessAction: [[], 'toEqual', mockAppAlone],
    restoreMisformatedAppAction: [getMockApps(), 'toEqual', getMockApps()],
    restoreAppAction: {
      multiple: [
        [
          [],
          'toEqual',
          [actionsMap.get('SAVE/RESTORE_APP').restoreAppAction.app]
        ],
        [
          [
            {
              slug: actionsMap.get('SAVE/RESTORE_APP').restoreAppAction.app
                .slug,
              customProp: 'mustBeRemoved'
            }
          ],
          'toEqual',
          [actionsMap.get('SAVE/RESTORE_APP').restoreAppAction.app]
        ]
      ]
    }
  },
  savedApp: {
    saveAppAction: [{}, 'toEqual', mockAppAlone[0]],
    saveMisformatedAppAction: [{}, 'toEqual', {}],
    restoreAppAction: [mockAppAlone[0], 'toEqual', {}],
    restoreMisformatedAppAction: [{ slug: 'formform' }, 'toEqual', {}]
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
  beforeEach(() => {
    jest.resetModules()
  })

  function expectToNotTouchTheState(reducer, action) {
    expect(reducer('default_state', action)).toBe('default_state')
  }
  Object.keys(reducersTestConfig).map(reducerName => {
    // for each reducer from the config
    if (reducersTestConfig.hasOwnProperty(reducerName)) {
      describe(reducerName, () => {
        beforeEach(() => {
          jest.resetAllMocks()
          jest.resetModules()
        })
        it('- No action provided', () => {
          expectToNotTouchTheState(reducer)
        })
        const reducerConfig = reducersTestConfig[reducerName]
        const reducer = reducersMap.get(reducerName)
        // we get all actions group defined in the actions Map
        actionsMap.forEach((actionsGroup, actionsGroupName) => {
          it(`- ${actionsGroupName}`, () => {
            // we test all actions from the group
            Object.keys(actionsGroup).map(actionName => {
              const action = actionsGroup[actionName]
              // if defined in the reducer config, we use provided parameters
              if (reducerConfig.hasOwnProperty(actionName)) {
                const params = reducerConfig[actionName]
                if (Array.isArray(params.multiple)) {
                  params.multiple.forEach(unitParams => {
                    _get(expect(reducer(unitParams[0], action)), unitParams[1])(
                      unitParams[2]
                    )
                  })
                } else {
                  _get(expect(reducer(params[0], action)), params[1])(params[2])
                }
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

describe('Apps ducks helpers', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('_sortAlphabetically should sort alphabetically according to the provided property name', () => {
    expect(
      _sortAlphabetically(
        [{ slug: 'bibi' }, { slug: 'aya' }, { slug: 'bab' }],
        'slug'
      )
    ).toMatchSnapshot()
    expect(
      _sortAlphabetically(
        [{ custom: 'bibi' }, { custom: 'aya' }, { custom: 'bab' }],
        'custom'
      )
    ).toMatchSnapshot()
  })

  it('_consolidateApps should merge correctly two apps infos lists', () => {
    expect(
      _consolidateApps(getMockApps(), mockAppAlone, 'en')
    ).toMatchSnapshot()
  })
})
