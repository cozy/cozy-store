/* eslint-env browser */
/* global cozy */

import { combineReducers } from 'redux'
import config from 'config/apps'

import { NotUninstallableAppException } from '../../lib/exceptions'

const APP_STATE = {
  READY: 'ready',
  INSTALLING: 'installing',
  ERRORED: 'errored'
}

export const APP_TYPE = {
  KONNECTOR: 'konnector',
  WEBAPP: 'webpapp'
}

const COLLECT_RELATED_PATH = '#/providers/all'

const DEFAULT_CHANNEL = 'dev'

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
  isInstalling
})

export function getInstalledApps (state) {
  return state.apps.list.filter(app => app.installed)
}

export function getRegistryApps (state) {
  // display only apps with stable versions for now
  return state.apps.list
    .filter(app => app.isInRegistry)
    .filter(app => Array.isArray(app.versions.stable) && !!app.versions.stable)
}

export function getLocalizedAppProperty (app, property, lang) {
  if (app.locales && app.locales[lang] && app.locales[lang][property]) {
    return app.locales[lang][property]
  }
  return app[property]
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
  } catch (e) {
    // eslint-disable-line
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

// FIXME retro-compatibility for old formatted manifest
function _sanitizeOldManifest (app) {
  if (!app.short_description) app.short_description = app.description
  if (!app.long_description) app.long_description = app.description
  if (typeof app.name === 'object') app.name = app.name.en
  return app
}

// all konnector slugs begin by konnector- in the registry
// so we remove this prefix before using it with the stack
function _getStackSlug (slug = '') {
  return slug.replace(/^konnector-/, '')
}

export function getFormattedInstalledApp (response, collectLink) {
  // FIXME retro-compatibility for old formatted manifest
  response.attributes = _sanitizeOldManifest(response.attributes)

  return _getIcon(response.links.icon).then(iconData => {
    const manifest = response.attributes
    const openingLink = response.attributes.type === APP_TYPE.KONNECTOR
      ? `${collectLink}/${COLLECT_RELATED_PATH}/${_getStackSlug(manifest.slug)}`
      : response.links.related
    const screensLinks =
      manifest.screenshots &&
      manifest.screenshots.map(name => {
        const fileName = name.replace(/^.*[\\/]/, '')
        return `${cozy.client._url}/registry/${
          manifest.slug
        }/${manifest.version}/screenshots/${fileName}`
      })
    return Object.assign({}, response.attributes, {
      _id: response.id || response._id,
      icon: iconData,
      installed: true,
      related: openingLink,
      screenshots: screensLinks,
      uninstallable: !config.notRemovableApps.includes(response.attributes.slug)
    })
  })
}

export function getFormattedRegistryApp (response, channel) {
  return cozy.client
    .fetchJSON('GET', `/registry/${response.slug}/${channel}/latest`)
    .then(version => {
      const versionFromRegistry = version.version
      const manifest = version.manifest
      const screensLinks =
        manifest.screenshots &&
        manifest.screenshots.map(name => {
          const fileName = name.replace(/^.*[\\/]/, '')
          return `${cozy.client._url}/registry/${
            manifest.slug
          }/${versionFromRegistry}/screenshots/${fileName}`
        })
      const iconLink = `${cozy.client._url}/registry/${
        manifest.slug
      }/${versionFromRegistry}/icon`
      return Object.assign(
        {},
        {
          versions: response.versions
        },
        manifest,
        {
          icon: iconLink,
          // the konnector manifest type must stay 'node'
          // for the stack so we use appType here
          type: version.type,
          // add screensLinks property only if it exists
          ...(screensLinks ? {screenshots: screensLinks} : {}),
          installed: false,
          uninstallable: true,
          isInRegistry: true
        }
      )
    })
}

export function fetchInstalledApps () {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_APPS })
    try {
      let installedWebApps = await cozy.client
        .fetchJSON('GET', '/apps/')
      const collectApp = installedWebApps.find(a => a.attributes.slug === 'collect')
      const collectLink = collectApp && collectApp.links.related
      installedWebApps = installedWebApps.filter(
        app =>
          !config.notDisplayedApps.includes(app.attributes.slug)
      )
      let installedKonnectors = await cozy.client
        .fetchJSON('GET', '/konnectors/')
      installedKonnectors = installedKonnectors.filter(
        app =>
          !config.notDisplayedApps.includes(app.attributes.slug)
      )
      const installedApps = installedWebApps.concat(installedKonnectors)
      Promise.all(
        installedApps.map(app => {
          return getFormattedInstalledApp(app, collectLink)
        })
      ).then(apps => {
        return dispatch({ type: FETCH_APPS_SUCCESS, apps })
      })
    } catch (e) {
      dispatch({ type: FETCH_APPS_FAILURE, error: e })
      throw e
    }
  }
}

export function fetchRegistryApps (channel = DEFAULT_CHANNEL) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_APPS })
    return cozy.client
      .fetchJSON('GET', '/registry')
      .then(response => {
        const apps = response.data
          .filter(app => !config.notDisplayedApps.includes(app.name))
          .filter(app => app.versions.dev && app.versions.dev.length) // only apps with versions available
        return Promise.all(
          apps.map(app => {
            return getFormattedRegistryApp(app, channel).catch(err => {
              console.warn(
                `Something went wrong when trying to fetch more informations about ${
                  app.slug
                } from the registry on ${channel} channel, so we skip it. ${err}`
              )
              return false // useful to skip in an array.map function
            })
          })
        ).then(apps => {
          return dispatch({ type: FETCH_REGISTRY_APPS_SUCCESS, apps })
        })
      })
      .catch(e => {
        dispatch({ type: FETCH_APPS_FAILURE, error: e })
        throw e
      })
  }
}

export function fetchApps () {
  return (dispatch, getState) => {
    dispatch(fetchRegistryApps()).then(() => dispatch(fetchInstalledApps()))
  }
}

export function uninstallApp (slug, type) {
  return (dispatch, getState) => {
    if (
      config.notRemovableApps.includes(slug) ||
      config.notDisplayedApps.includes(slug)
    ) {
      const error = new NotUninstallableAppException()
      dispatch({ type: UNINSTALL_APP_FAILURE, error })
      throw error
    }
    // FIXME: hack to handle node type from stack for the konnectors
    const route = (type === APP_TYPE.KONNECTOR || type === 'node')
      ? 'konnectors' : 'apps'
    return cozy.client
      .fetchJSON('DELETE', `/${route}/${_getStackSlug(slug)}`)
      .then(() => {
        // remove the app from the state apps list
        const apps = getState().apps.list.map(app => {
          if (app.slug === slug) app.installed = false
          return app
        })
        dispatch({ type: UNINSTALL_APP_SUCCESS, apps })
        return dispatch({
          type: 'SEND_LOG_SUCCESS',
          alert: {
            message: 'app_modal.uninstall.message.success',
            level: 'success'
          }
        })
      })
      .catch(e => {
        dispatch({ type: UNINSTALL_APP_FAILURE, error: e })
        throw e
      })
  }
}

export function installApp (slug, type, source, isUpdate = false) {
  return (dispatch, getState) => {
    dispatch({ type: INSTALL_APP })
    const verb = isUpdate ? 'PUT' : 'POST'
    const route = type === APP_TYPE.KONNECTOR
      ? 'konnectors' : 'apps'
    return cozy.client
      .fetchJSON(
        verb,
        `/${route}/${_getStackSlug(slug)}?Source=${encodeURIComponent(source)}`
      ).then(resp => waitForAppReady(resp))
      .then(appResponse => {
        return getFormattedInstalledApp(appResponse)
          .then(app => {
            // add the installed app to the state apps list
            const apps = getState().apps.list.map(a => {
              if (a.slug === slug) {
                return Object.assign({}, a, app, { installed: true })
              }
              return a
            })
            dispatch({ type: INSTALL_APP_SUCCESS, apps })
            return dispatch({
              type: 'SEND_LOG_SUCCESS',
              alert: {
                message: `app_modal.install.message.${
                  isUpdate ? 'update' : 'install'
                }_success`,
                level: 'success'
              }
            })
          })
      })
      .catch(e => {
        dispatch({ type: INSTALL_APP_FAILURE, error: e })
        throw e
      })
  }
}

export function installAppFromRegistry (slug, type, channel = DEFAULT_CHANNEL) {
  return (dispatch, getState) => {
    const source = `registry://${slug}/${channel}`
    return dispatch(installApp(slug, type, source, false))
  }
}

// monitor the status of the app and resolve when the app is ready
function waitForAppReady (app, timeout = 20 * 1000) {
  if (app.attributes.state === APP_STATE.READY) return app
  return new Promise((resolve, reject) => {
    let idTimeout
    let idInterval

    // FIXME: hack to handle node type from stack for the konnectors
    const route =
      (app.attributes.type === APP_TYPE.KONNECTOR || app.attributes.type === 'node')
        ? 'konnectors'
        : 'apps'

    idTimeout = setTimeout(() => {
      clearInterval(idInterval)
      resolve(app)
    }, timeout)

    idInterval = setInterval(() => {
      cozy.client
        .fetchJSON('GET', `/${route}/${app.attributes.slug}`)
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
