/* eslint-env browser */
/* global cozy */

import { combineReducers } from 'redux'
import { currentAppVersionReducers } from './currentAppVersion'
import config from 'config/apps'

import {
  NotUninstallableAppException
} from '../../lib/exceptions'

const APP_STATE = {
  READY: 'ready',
  INSTALLING: 'installing',
  ERRORED: 'errored'
}

const FETCH_APPS = 'FETCH_APPS'
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
const FETCH_APPS_FAILURE = 'FETCH_APPS_FAILURE'

const FETCH_REGISTRY_APPS_SUCCESS = 'FETCH_REGISTRY_APPS_SUCCESS'

const UNINSTALL_APP_SUCCESS = 'UNINSTALL_APP_SUCCESS'
const UNINSTALL_APP_FAILURE = 'UNINSTALL_APP_FAILURE'

const INSTALL_APP = 'INSTALL_APP'
const INSTALL_APP_SUCCESS = 'INSTALL_APP_SUCCESS'
const INSTALL_APP_FAILURE = 'INSTALL_APP_FAILURE'

export const list = (state = [], action) => {
  switch (action.type) {
    case FETCH_REGISTRY_APPS_SUCCESS:
      return _sortAlphabetically(_consolidateApps(state, action.apps), 'slug')
    case FETCH_APPS_SUCCESS:
      return _sortAlphabetically(_consolidateApps(state, action.apps), 'slug')
    case UNINSTALL_APP_SUCCESS:
    case INSTALL_APP_SUCCESS:
      return _sortAlphabetically(action.apps, 'slug')
    default:
      return state
  }
}

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_APPS:
      return true
    case FETCH_APPS_SUCCESS:
    case FETCH_APPS_FAILURE:
      return false
    default:
      return state
  }
}

export const isInstalling = (state = false, action) => {
  switch (action.type) {
    case INSTALL_APP:
      return true
    case INSTALL_APP_SUCCESS:
    case INSTALL_APP_FAILURE:
      return false
    default:
      return state
  }
}

export const actionError = (state = null, action) => {
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

export const fetchError = (state = null, action) => {
  switch (action.type) {
    case FETCH_APPS_FAILURE:
      return action.error
    case FETCH_APPS_SUCCESS:
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
  isInstalling,
  currentAppVersion: currentAppVersionReducers
})

export function getInstalledApps (state) {
  return state.apps.list.filter(app => app.installed)
}

export function getRegistryApps (state) {
  // display only apps with stable versions for now
  return state.apps.list.filter(app => app.isInRegistry).filter(app => (Array.isArray(app.versions.stable) && !!app.versions.stable))
}

function _sortAlphabetically (array, property) {
  return array.sort((a, b) => a[property] > b[property])
}

async function _getIcon (url) {
  if (!url) return ''
  let icon
  try {
    icon = await cozy.client.fetchJSON('GET', url)
  } catch (e) {
    return ''
  }

  try {
    return 'data:image/svg+xml;base64,' + btoa(icon)
  } catch (e) { // eslint-disable-line
    try {
      return URL.createObjectURL(icon)
    } catch (e) {
      return ''
    }
  }
}

function _consolidateApps (stateApps, newAppsInfos) {
  const apps = new Map()
  stateApps.forEach(app => apps.set(app.slug, app))
  newAppsInfos.forEach(app => {
    const appFromState = apps.get(app.slug)
    if (appFromState) {
      apps.set(app.slug, Object.assign({}, appFromState, app))
    } else {
      apps.set(app.slug, app)
    }
  })
  return Array.from(apps.values()).filter(app => app)
}

export function fetchInstalledApps () {
  return (dispatch, getState) => {
    dispatch({type: FETCH_APPS})
    return cozy.client.fetchJSON('GET', '/apps/')
    .then(installedApps => {
      installedApps = installedApps.filter(app => !config.notDisplayedApps.includes(app.attributes.slug))
      Promise.all(installedApps.map(app => {
        // FIXME waiting name and description is locales object everywhere
        const appDesc = typeof app.attributes.description === 'string'
          ? { en: app.attributes.description } : app.attributes.description
        const appName = typeof app.attributes.name === 'string'
          ? { en: app.attributes.name } : app.attributes.name
        return _getIcon(app.links.icon)
        .then(iconData => {
          return Object.assign({}, app.attributes, {
            _id: app.id,
            icon: iconData,
            name: appName,
            description: appDesc,
            installed: true,
            related: app.links.related,
            uninstallable: !config.notRemovableApps.includes(app.attributes.slug)
          })
        })
      }))
      .then(apps => {
        return dispatch({type: FETCH_APPS_SUCCESS, apps})
      })
    })
    .catch(e => {
      dispatch({type: FETCH_APPS_FAILURE, error: e})
      throw e
    })
  }
}

export function fetchRegistryApps () {
  return (dispatch, getState) => {
    dispatch({type: FETCH_APPS})
    return cozy.client.fetchJSON('GET', '/registry?filter[type]=webapp')
    .then(response => {
      const apps = response.data
      .filter(app => !config.notDisplayedApps.includes(app.name))
      .filter(app => app.versions.dev && app.versions.dev.length) // only apps with versions available
      return Promise.all(apps.map(app => {
        return _getIcon(`/registry/${app.slug}/icon`)
        .then(iconData => {
          return Object.assign({}, app, {
            icon: iconData,
            installed: false,
            uninstallable: true,
            isInRegistry: true
          })
        })
      }))
      .then(apps => {
        return dispatch({type: FETCH_REGISTRY_APPS_SUCCESS, apps})
      })
    })
    .catch(e => {
      dispatch({type: FETCH_APPS_FAILURE, error: e})
      throw e
    })
  }
}

export function fetchApps () {
  return (dispatch, getState) => {
    dispatch(fetchRegistryApps())
    .then(() => dispatch(fetchInstalledApps()))
  }
}

export function uninstallApp (slug) {
  return (dispatch, getState) => {
    if (config.notRemovableApps.includes(slug) || config.notDisplayedApps.includes(slug)) {
      const error = new NotUninstallableAppException()
      dispatch({ type: UNINSTALL_APP_FAILURE, error })
      throw error
    }
    return cozy.client.fetchJSON('DELETE', `/apps/${slug}`)
    .then(() => {
      // remove the app from the state apps list
      const apps = getState().apps.list.map(app => {
        if (app.slug === slug) app.installed = false
        return app
      })
      dispatch({type: UNINSTALL_APP_SUCCESS, apps})
      return dispatch({
        type: 'SEND_LOG_SUCCESS',
        alert: {
          message: 'app_modal.uninstall.message.success',
          level: 'success'
        }
      })
    })
    .catch(e => {
      dispatch({type: UNINSTALL_APP_FAILURE, error: e})
      throw e
    })
  }
}

export function installApp (slug, source, isUpdate = false) {
  return (dispatch, getState) => {
    dispatch({type: INSTALL_APP})
    const verb = isUpdate ? 'PUT' : 'POST'
    return cozy.client.fetchJSON(verb, `/apps/${slug}?Source=${encodeURIComponent(source)}`)
    .then(resp => waitForAppReady(resp))
    .then(appData => {
      return _getIcon(appData.links.icon)
      .then(iconData => {
        return Object.assign({}, appData.attributes, {
          _id: appData.id,
          icon: iconData,
          installed: true,
          uninstallable: !config.notRemovableApps.includes(appData.attributes.slug)
        })
      })
      .then(app => {
        // add the installed app to the state apps list
        const apps = getState().apps.list.map(a => {
          if (a.slug === slug) {
            return Object.assign({}, a, app, {installed: true})
          }
          return a
        })
        dispatch({type: INSTALL_APP_SUCCESS, apps})
        return dispatch({
          type: 'SEND_LOG_SUCCESS',
          alert: {
            message: `app_modal.install.message.${isUpdate ? 'update' : 'install'}_success`,
            level: 'success'
          }
        })
      })
    })
    .catch(e => {
      dispatch({type: INSTALL_APP_FAILURE, error: e})
      throw e
    })
  }
}

export function installAppFromRegistry (slug, channel = 'stable') {
  return (dispatch, getState) => {
    const source = `registry://${slug}/${channel}`
    return dispatch(installApp(slug, source, false))
  }
}

// monitor the status of the app and resolve when the app is ready
function waitForAppReady (app, timeout = 20 * 1000) {
  if (app.attributes.state === APP_STATE.READY) return app
  return new Promise((resolve, reject) => {
    let idTimeout
    let idInterval

    idTimeout = setTimeout(() => {
      clearInterval(idInterval)
      resolve(app)
    }, timeout)

    idInterval = setInterval(() => {
      cozy.client.fetchJSON('GET', `/apps/${app.attributes.slug}`)
        .then(app => {
          if (app.attributes.state === APP_STATE.ERRORED) {
            if (idTimeout) {
              clearTimeout(idTimeout)
            }

            clearInterval(idInterval)
            reject(new Error('Error when installing the application'))
          }

          if (app.attributes.state === APP_STATE.READY) {
            if (idTimeout) {
              clearTimeout(idTimeout)
            }

            clearInterval(idInterval)
            resolve(app)
          }
        })
        .catch(error => {
          if (error.status === 404) return // keep waiting
          if (idTimeout) {
            clearTimeout(idTimeout)
          }

          clearInterval(idInterval)
          reject(error)
        })
    }, 1000)
  })
}
