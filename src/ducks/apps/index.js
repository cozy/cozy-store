/* eslint-env browser */
/* global cozy */

import { combineReducers } from 'redux'
import { currentAppVersionReducers } from './currentAppVersion'

import {
  NotUninstallableAppException
} from '../../lib/exceptions'

const APP_STATE = {
  READY: 'ready',
  INSTALLING: 'installing',
  ERRORED: 'errored'
}

const NOT_REMOVABLE_APPS = ['drive', 'collect']
const NOT_DISPLAYED_APPS = ['settings', 'store', 'onboarding']

const FETCH_APPS = 'FETCH_APPS'
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
const FETCH_APPS_FAILURE = 'FETCH_APPS_FAILURE'

const FETCH_REGISTRY_APPS_SUCCESS = 'FETCH_REGISTRY_APPS_SUCCESS'

const UNINSTALL_APP_SUCCESS = 'UNINSTALL_APP_SUCCESS'
const UNINSTALL_APP_FAILURE = 'UNINSTALL_APP_FAILURE'

const INSTALL_APP = 'INSTALL_APP'
const INSTALL_APP_SUCCESS = 'INSTALL_APP_SUCCESS'
const INSTALL_APP_FAILURE = 'INSTALL_APP_FAILURE'

const list = (state = [], action) => {
  switch (action.type) {
    case FETCH_REGISTRY_APPS_SUCCESS:
      return _consolidateApps(state, action.apps)
    case FETCH_APPS_SUCCESS:
      return _consolidateApps(state, action.apps)
    case UNINSTALL_APP_SUCCESS:
    case INSTALL_APP_SUCCESS:
      return action.apps
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
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

const isInstalling = (state = false, action) => {
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
    const appsFromState = apps.get(app.slug)
    if (appsFromState) {
      apps.set(app.slug, Object.assign({}, appsFromState, app))
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
      installedApps = installedApps.filter(app => !NOT_DISPLAYED_APPS.includes(app.attributes.slug))
      Promise.all(installedApps.map(app => {
        return _getIcon(app.links.icon)
        .then(iconData => {
          return Object.assign({}, app.attributes, {
            _id: app.id,
            icon: iconData,
            installed: true,
            related: app.links.related,
            uninstallable: !NOT_REMOVABLE_APPS.includes(app.attributes.slug)
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

export function fetchRegistryApps (lang = 'en') {
  return (dispatch, getState) => {
    dispatch({type: FETCH_APPS})
    return cozy.client.fetchJSON('GET', '/registry?filter[type]=webapp')
    .then(response => {
      const apps = response.data
      .filter(app => !NOT_DISPLAYED_APPS.includes(app.name))
      .filter(app => app.versions.dev && app.versions.dev.length) // only apps with versions available
      return Promise.all(apps.map(app => {
        const appName = (app.name && (app.name[lang] || app.name.en)) || app.slug
        const appDesc = (app.description && (app.description[lang] || app.description.en)) || ''
        return _getIcon(app.logo_url)
        .then(iconData => {
          return Object.assign({}, app, {
            icon: iconData,
            name: appName,
            installed: false,
            description: appDesc,
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

export function fetchApps (lang) {
  return (dispatch, getState) => {
    dispatch(fetchRegistryApps(lang))
    .then(() => dispatch(fetchInstalledApps()))
  }
}

export function uninstallApp (slug) {
  return (dispatch, getState) => {
    if (NOT_REMOVABLE_APPS.includes(slug) || NOT_DISPLAYED_APPS.includes(slug)) {
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
          uninstallable: !NOT_REMOVABLE_APPS.includes(appData.attributes.slug)
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
