/* eslint-env browser */
/* global cozy */

import { combineReducers } from 'redux'
import config from 'config/apps'
import constants from 'config/constants'
import categories from 'config/categories'
import { extend as extendI18n } from 'cozy-ui/react/I18n'
import { NotUninstallableAppException } from '../../lib/exceptions'

const APP_STATE = {
  READY: 'ready',
  INSTALLING: 'installing',
  ERRORED: 'errored'
}

export const APP_TYPE = {
  KONNECTOR: 'konnector',
  WEBAPP: 'webapp'
}

export const REGISTRY_CHANNELS = {
  DEV: 'dev',
  BETA: 'beta',
  STABLE: 'stable'
}

const AUTHORIZED_CATEGORIES = categories

const COLLECT_RELATED_PATH = constants.collect

const DEFAULT_CHANNEL = constants.default.registry.channel

const FETCH_APPS = 'FETCH_APPS'
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
const FETCH_APPS_FAILURE = 'FETCH_APPS_FAILURE'

const FETCH_APP = 'FETCH_APP'
const FETCH_APP_SUCCESS = 'FETCH_APP_SUCCESS'
const FETCH_APP_FAILURE = 'FETCH_APP_FAILURE'

const FETCH_REGISTRY_APPS_SUCCESS = 'FETCH_REGISTRY_APPS_SUCCESS'

const UNINSTALL_APP_SUCCESS = 'UNINSTALL_APP_SUCCESS'
const UNINSTALL_APP_FAILURE = 'UNINSTALL_APP_FAILURE'

const INSTALL_APP = 'INSTALL_APP'
const INSTALL_APP_SUCCESS = 'INSTALL_APP_SUCCESS'
const INSTALL_APP_FAILURE = 'INSTALL_APP_FAILURE'

export const list = (state = [], action) => {
  switch (action.type) {
    case FETCH_REGISTRY_APPS_SUCCESS:
      return _sortAlphabetically(
        _consolidateApps(state, action.apps, action.lang),
        'slug'
      )
    case FETCH_APP_SUCCESS:
    case FETCH_APPS_SUCCESS:
      return _sortAlphabetically(
        _consolidateApps(state, action.apps, action.lang),
        'slug'
      )
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

export const isAppFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_APP:
      return true
    case FETCH_APP_SUCCESS:
    case FETCH_APP_FAILURE:
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
  isInstalling
})

// Selectors

export function getAppBySlug(state, slug) {
  return state.apps.list.find(app => app.slug === slug)
}

export function getInstalledApps(state) {
  return state.apps.list.filter(app => app.installed)
}

export function getRegistryApps(state) {
  // display only apps with stable versions for now
  return state.apps.list
    .filter(app => app.isInRegistry)
    .filter(app => Array.isArray(app.versions.stable) && !!app.versions.stable)
}

export function getLocalizedAppProperty(app, property, lang) {
  if (app.locales && app.locales[lang] && app.locales[lang][property]) {
    return app.locales[lang][property]
  }
  return app[property]
}

function _sortAlphabetically(array, property) {
  return array.sort((a, b) => a[property] > b[property])
}

/* Only for the icon fetching */
const root = document.querySelector('[role=application]')
const data = root && root.dataset
const COZY_TOKEN = data && data.cozyToken
const COZY_DOMAIN = data && `//${data.cozyDomain}`
/* Only for the icon fetching */

async function _getIcon(url) {
  if (!url) return ''
  let icon
  try {
    const resp = await fetch(`${COZY_DOMAIN}${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${COZY_TOKEN}`
      }
    })
    if (!resp.ok)
      throw new Error(`Error while fetching icon: ${resp.statusText}: ${url}`)
    icon = await resp.blob()
  } catch (e) {
    return ''
  }
  // check if MIME type is an image
  if (!icon.type.match(/^image\/.*$/)) return ''
  return URL.createObjectURL(icon)
}

function _consolidateApps(stateApps, newAppsInfos, lang) {
  const apps = new Map()
  stateApps.forEach(app => apps.set(app.slug, app))
  newAppsInfos.forEach(app => {
    if (app.locales && app.locales[lang]) {
      extendI18n({ [app.slug]: app.locales[lang] })
    }
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
function _sanitizeOldManifest(app) {
  if (!app.categories && app.category && typeof app.category === 'string')
    app.categories = [app.category]
  if (typeof app.name === 'object') app.name = app.name.en
  return app
}

// check authorized categories and add default 'others'
function _sanitizeCategories(categoriesList) {
  if (!categoriesList) return ['others']
  const filteredList = categoriesList.filter(c =>
    AUTHORIZED_CATEGORIES.includes(c)
  )
  if (!filteredList.length) return ['others']
  return filteredList
}

let contextCache
export function getContext() {
  return contextCache
    ? Promise.resolve(contextCache)
    : cozy.client
        .fetchJSON('GET', '/settings/context')
        .then(context => {
          contextCache = context
          return context
        })
        .catch(error => {
          if (error.status && error.status === 404) {
            contextCache = {}
            return contextCache
          }
        })
}

export function getFormattedInstalledApp(response, collectLink) {
  // FIXME retro-compatibility for old formatted manifest
  response.attributes = _sanitizeOldManifest(response.attributes)

  return _getIcon(response.links.icon).then(iconData => {
    const manifest = response.attributes
    const openingLink =
      response.attributes.type === APP_TYPE.KONNECTOR
        ? `${collectLink}/${COLLECT_RELATED_PATH}/${manifest.slug}`
        : response.links.related
    const screensLinks =
      manifest.screenshots &&
      manifest.screenshots.map(name => {
        const fileName = name.replace(/^.*[\\/]/, '')
        return `${cozy.client._url}/registry/${manifest.slug}/${
          manifest.version
        }/screenshots/${fileName}`
      })
    return Object.assign({}, response.attributes, {
      _id: response.id || response._id,
      icon: iconData,
      categories: _sanitizeCategories(manifest.categories),
      installed: true,
      related: openingLink,
      screenshots: screensLinks,
      uninstallable: !config.notRemovableApps.includes(response.attributes.slug)
    })
  })
}

export function fetchLatestApp(slug, channel = DEFAULT_CHANNEL) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_APP })
    const app = getState().apps.list.find(a => a.slug === slug)
    if (!app) {
      return dispatch({
        type: FETCH_APP_FAILURE,
        error: new Error(`Application ${slug} not found.`)
      })
    }
    return getFormattedRegistryApp(app, channel)
      .then(fetched => {
        // replace the new fetched app in the apps list
        return dispatch({
          type: FETCH_APP_SUCCESS,
          apps: [fetched]
        })
      })
      .catch(err => {
        if (err.status === 404) {
          console.warn(
            `No ${channel} version found for ${app.slug} from the registry.`
          )
        } else {
          console.warn(
            `Something went wrong when trying to fetch more informations about ${
              app.slug
            } from the registry on ${channel} channel. ${err}`
          )
        }
        dispatch({ type: FETCH_APP_FAILURE, error: err })
        throw err
      })
  }
}

export function getFormattedRegistryApp(response, channel) {
  return cozy.client
    .fetchJSON('GET', `/registry/${response.slug}/${channel}/latest`)
    .then(version => {
      // FIXME retro-compatibility for old formatted manifest
      const manifest = _sanitizeOldManifest(version.manifest)
      // source is only used by the stack when installed
      // so we removed it from the app manifest if present
      if (manifest.source) delete manifest.source

      const versionFromRegistry = version.version
      const screensLinks =
        manifest.screenshots &&
        manifest.screenshots.map(name => {
          const fileName = name.replace(/^.*[\\/]/, '')
          return `${cozy.client._url}/registry/${
            manifest.slug
          }/${versionFromRegistry}/screenshots/${fileName}`
        })
      const iconLink = `/registry/${manifest.slug}/${versionFromRegistry}/icon`
      return _getIcon(iconLink).then(iconData => {
        return Object.assign(
          {},
          {
            versions: response.versions
          },
          manifest,
          {
            icon: iconData,
            version: versionFromRegistry,
            type: version.type,
            categories: _sanitizeCategories(manifest.categories),
            uninstallable: !config.notRemovableApps.includes(manifest.slug),
            isInRegistry: true,
            // add screensLinks property only if it exists
            ...(screensLinks ? { screenshots: screensLinks } : {}),
            // add installed value only if not already provided
            installed: response.installed || false
          }
        )
      })
    })
}

export function fetchInstalledApps(lang) {
  return async dispatch => {
    dispatch({ type: FETCH_APPS })
    try {
      let installedWebApps = await cozy.client.fetchJSON('GET', '/apps/')
      installedWebApps = installedWebApps.map(w => {
        // FIXME type konnector is missing from stack
        w.attributes.type = 'webapp'
        return w
      })
      // TODO throw error if collect is not installed
      const collectApp = installedWebApps.find(
        a => a.attributes.slug === 'collect'
      )
      const collectLink = collectApp && collectApp.links.related
      installedWebApps = installedWebApps.filter(
        app => !config.notDisplayedApps.includes(app.attributes.slug)
      )
      let installedKonnectors = await cozy.client.fetchJSON(
        'GET',
        '/konnectors/'
      )
      installedKonnectors = installedKonnectors.map(k => {
        // FIXME type konnector is missing from stack
        k.attributes.type = 'konnector'
        return k
      })
      installedKonnectors = installedKonnectors.filter(
        app => !config.notDisplayedApps.includes(app.attributes.slug)
      )
      const installedApps = installedWebApps.concat(installedKonnectors)
      Promise.all(
        installedApps.map(app => {
          return getFormattedInstalledApp(app, collectLink)
        })
      ).then(apps => {
        return dispatch({ type: FETCH_APPS_SUCCESS, apps, lang })
      })
    } catch (e) {
      dispatch({ type: FETCH_APPS_FAILURE, error: e })
      throw e
    }
  }
}

export function fetchRegistryApps(lang, channel = DEFAULT_CHANNEL) {
  return dispatch => {
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
              if (err.status === 404) {
                console.warn(
                  `No ${channel} version found for ${
                    app.slug
                  } from the registry.`
                )
              } else {
                console.warn(
                  `Something went wrong when trying to fetch more informations about ${
                    app.slug
                  } from the registry on ${channel} channel. ${err}`
                )
              }
              return false // useful to skip in an array.map function
            })
          })
        ).then(apps => {
          return dispatch({ type: FETCH_REGISTRY_APPS_SUCCESS, apps, lang })
        })
      })
      .catch(e => {
        dispatch({ type: FETCH_APPS_FAILURE, error: e })
        throw e
      })
  }
}

export function fetchApps(lang) {
  return dispatch => {
    dispatch(fetchRegistryApps(lang)).then(() =>
      dispatch(fetchInstalledApps(lang))
    )
  }
}

export function uninstallApp(slug, type) {
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
    const route =
      type === APP_TYPE.KONNECTOR || type === 'node' ? 'konnectors' : 'apps'
    return cozy.client
      .fetchJSON('DELETE', `/${route}/${slug}`)
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

export function installApp(slug, type, source, isUpdate = false) {
  return (dispatch, getState) => {
    dispatch({ type: INSTALL_APP })
    const verb = isUpdate ? 'PUT' : 'POST'
    const route = type === APP_TYPE.KONNECTOR ? 'konnectors' : 'apps'
    return cozy.client
      .fetchJSON(verb, `/${route}/${slug}?Source=${encodeURIComponent(source)}`)
      .then(resp => {
        // FIXME type konnector is missing from stack
        resp.attributes.type = 'konnector'
        return waitForAppReady(resp)
      })
      .then(appResponse => {
        // TODO throw error if collect is not installed
        const collectApp = getState().apps.list.find(a => a.slug === 'collect')
        const collectLink = collectApp && collectApp.related
        return getFormattedInstalledApp(appResponse, collectLink).then(app => {
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

export function installAppFromRegistry(
  slug,
  type,
  channel = DEFAULT_CHANNEL,
  isUpdate = false
) {
  return dispatch => {
    const source = `registry://${slug}/${channel}`
    return dispatch(installApp(slug, type, source, isUpdate))
  }
}

// monitor the status of the app and resolve when the app is ready
function waitForAppReady(app, timeout = 30 * 1000) {
  if (app.attributes.state === APP_STATE.READY) return app
  return new Promise((resolve, reject) => {
    let idTimeout
    let idInterval

    // FIXME: hack to handle node type from stack for the konnectors
    const route =
      app.attributes.type === APP_TYPE.KONNECTOR ||
      app.attributes.type === 'node'
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
