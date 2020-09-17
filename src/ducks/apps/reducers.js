'use strict'

import { extend as extendI18n } from 'cozy-ui/transpiled/react/I18n'
import { combineReducers } from 'redux'

// initial loading
export const LOADING_APP = 'LOADING_APP'
export const LOADING_APP_INTENT = 'LOADING_APP_INTENT'

export const FETCH_APPS = 'FETCH_APPS'
export const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
export const FETCH_APPS_FAILURE = 'FETCH_APPS_FAILURE'

export const FETCH_APP = 'FETCH_APP'
export const FETCH_APP_SUCCESS = 'FETCH_APP_SUCCESS'
export const FETCH_APP_FAILURE = 'FETCH_APP_FAILURE'

// store an app state, to handle app version switch cancelling
export const RESTORE_APP = 'RESTORE_APP'
export const SAVE_APP = 'SAVE_APP'

export const FETCH_REGISTRY_APPS_SUCCESS = 'FETCH_REGISTRY_APPS_SUCCESS'

export const UNINSTALL_APP = 'UNINSTALL_APP'
export const UNINSTALL_APP_SUCCESS = 'UNINSTALL_APP_SUCCESS'
export const UNINSTALL_APP_FAILURE = 'UNINSTALL_APP_FAILURE'

export const INSTALL_APP = 'INSTALL_APP'
export const INSTALL_APP_SUCCESS = 'INSTALL_APP_SUCCESS'
export const INSTALL_APP_FAILURE = 'INSTALL_APP_FAILURE'

export function _sortAlphabetically(array, property) {
  return array.sort((a, b) => a[property] > b[property])
}

export function _isValidApp(app) {
  return !!app && !!app.slug && !!app.source && !!app.version
}

export function _consolidateApps(stateApps, newAppsInfos, lang) {
  const apps = new Map()
  stateApps.forEach(app => apps.set(app.slug, app))
  newAppsInfos.forEach(app => {
    const appFromState = apps.get(app.slug)
    // handle maintenance locales
    let appLocales = app.locales
    if (appLocales && appFromState && appFromState.locales) {
      for (let locale in appFromState.locales) {
        appLocales[locale] = Object.assign(
          {},
          appFromState.locales[locale],
          app.locales[locale]
        )
      }
    }
    if (appLocales && appLocales[lang]) {
      // access app locales from 'apps.slug.[...]'
      extendI18n({ apps: { [app.slug]: appLocales[lang] } })
    }
    if (appFromState) {
      apps.set(
        app.slug,
        Object.assign({}, appFromState, app, {
          locales: appLocales
        })
      )
    } else {
      apps.set(app.slug, app)
    }
  })
  return Array.from(apps.values()).filter(app => app)
}

export const list = (state = [], action = {}) => {
  switch (action.type) {
    case RESTORE_APP:
      if (_isValidApp(action.app)) {
        return _sortAlphabetically(
          _consolidateApps(
            // we completely replace it, so we remove the current from state
            state.filter(a => a.slug !== action.app.slug),
            [action.app],
            action.lang
          ),
          'slug'
        )
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `Failed attempt to restore a saved app state (app: ${action.app &&
            action.app.slug}).`
        )
        return state
      }
    case FETCH_APP_SUCCESS:
      return _sortAlphabetically(
        _consolidateApps(state, [action.app], action.lang),
        'slug'
      )
    case FETCH_REGISTRY_APPS_SUCCESS:
    case FETCH_APPS_SUCCESS:
      return _sortAlphabetically(
        _consolidateApps(state, action.apps, action.lang),
        'slug'
      )
    case UNINSTALL_APP_SUCCESS:
      return state.map(app =>
        app.slug === action.slug ? { ...app, installed: false } : app
      )
    case INSTALL_APP_SUCCESS: {
      return _sortAlphabetically(
        state.map(app => {
          if (app.slug === action.installedApp.slug) {
            const nextApp = { ...app, ...action.installedApp, installed: true }
            // the available update is now installed
            if (nextApp.availableVersion) delete nextApp.availableVersion
            return nextApp
          }
          return app
        }),
        'slug'
      )
    }
    default:
      return state
  }
}

export const savedApp = (state = null, action = {}) => {
  switch (action.type) {
    case SAVE_APP:
      return _isValidApp(action.app) ? action.app : state
    case RESTORE_APP:
    case INSTALL_APP_SUCCESS: // after install we clean the previously saved app
      return null
    default:
      return state
  }
}

export const isFetching = (state = false, action = {}) => {
  switch (action.type) {
    case LOADING_APP:
    case FETCH_APPS:
      return true
    case FETCH_APPS_SUCCESS:
    case FETCH_APPS_FAILURE:
      return false
    default:
      return state
  }
}

export const isAppFetching = (state = false, action = {}) => {
  switch (action.type) {
    case LOADING_APP_INTENT:
    case FETCH_APP:
      return true
    case RESTORE_APP: // restoring the saved app cancels the app fetching
      return _isValidApp(action.app) ? false : state
    case FETCH_APP_SUCCESS:
    case FETCH_APP_FAILURE:
      return false
    default:
      return state
  }
}

export const isInstalling = (state = false, action = {}) => {
  switch (action.type) {
    case INSTALL_APP:
      return action.slug
    case INSTALL_APP_SUCCESS:
    case INSTALL_APP_FAILURE:
      return false
    default:
      return state
  }
}

export const isUninstalling = (state = false, action = {}) => {
  switch (action.type) {
    case UNINSTALL_APP:
      return true
    case UNINSTALL_APP_SUCCESS:
    case UNINSTALL_APP_FAILURE:
      return false
    default:
      return state
  }
}

export const actionError = (state = null, action = {}) => {
  switch (action.type) {
    case UNINSTALL_APP_FAILURE:
    case INSTALL_APP_FAILURE:
      return action.error
    case UNINSTALL_APP_SUCCESS:
    case INSTALL_APP_SUCCESS:
      return null
    default:
      return state
  }
}

export const fetchError = (state = null, action = {}) => {
  switch (action.type) {
    case FETCH_APPS_FAILURE:
    case FETCH_APP_FAILURE:
      return action.error
    case FETCH_APPS_SUCCESS:
    case FETCH_APP_SUCCESS:
      return null
    default:
      return state
  }
}

export const appsReducers = combineReducers({
  list,
  actionError,
  fetchError,
  isFetching,
  isAppFetching,
  isInstalling,
  isUninstalling,
  savedApp
})
