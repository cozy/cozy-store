/* eslint-env browser */
/* global cozy */

import { combineReducers } from 'redux'
import config from 'config/apps'
import constants from 'config/constants'
import categories from 'config/categories'
import { extend as extendI18n } from 'cozy-ui/react/I18n'
import { NotUninstallableAppException } from '../../lib/exceptions'
import realtime from 'cozy-realtime'

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

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

const APPS_DOCTYPE = 'io.cozy.apps'
const KONNECTORS_DOCTYPE = 'io.cozy.konnectors'

const AUTHORIZED_CATEGORIES = categories

const COLLECT_RELATED_PATH = constants.collect

const DEFAULT_CHANNEL = constants.default.registry.channel

// initial loading
const LOADING_APP = 'LOADING_APP'
const LOADING_APP_INTENT = 'LOADING_APP_INTENT'

const FETCH_APPS = 'FETCH_APPS'
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
const FETCH_APPS_FAILURE = 'FETCH_APPS_FAILURE'

const FETCH_APP = 'FETCH_APP'
const FETCH_APP_SUCCESS = 'FETCH_APP_SUCCESS'
const FETCH_APP_FAILURE = 'FETCH_APP_FAILURE'

const FETCH_REGISTRY_APPS_SUCCESS = 'FETCH_REGISTRY_APPS_SUCCESS'

const UNINSTALL_APP = 'UNINSTALL_APP'
const UNINSTALL_APP_SUCCESS = 'UNINSTALL_APP_SUCCESS'
const UNINSTALL_APP_FAILURE = 'UNINSTALL_APP_FAILURE'

const INSTALL_APP = 'INSTALL_APP'
const INSTALL_APP_SUCCESS = 'INSTALL_APP_SUCCESS'
const INSTALL_APP_FAILURE = 'INSTALL_APP_FAILURE'

const RECEIVE_APPS_ICON = 'RECEIVE_APPS_ICON'

export const list = (state = [], action) => {
  switch (action.type) {
    case FETCH_APP_SUCCESS:
    case FETCH_REGISTRY_APPS_SUCCESS:
    case FETCH_APPS_SUCCESS:
      return _sortAlphabetically(
        _consolidateApps(state, action.apps, action.lang),
        'slug'
      )
    case UNINSTALL_APP_SUCCESS:
    case INSTALL_APP_SUCCESS:
      return _sortAlphabetically(action.apps, 'slug')
    case RECEIVE_APPS_ICON:
      return state.map(app => {
        if (action.iconsMap.has(app.slug)) {
          app.icon = action.iconsMap.get(app.slug)
          delete app.iconToLoad
        }
        return app
      })
    default:
      return state
  }
}

export const isFetching = (state = false, action) => {
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

export const isAppFetching = (state = false, action) => {
  switch (action.type) {
    case LOADING_APP_INTENT:
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

export const isUninstalling = (state = false, action) => {
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
  isInstalling,
  isUninstalling
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
    const appFromState = apps.get(app.slug)
    // handle maintenance locales
    let appLocales = app.locales
    if (appLocales && appFromState && appFromState.locales) {
      for (let lang in appFromState.locales) {
        appLocales[lang] = Object.assign(
          {},
          appFromState.locales[lang],
          app.locales[lang]
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

export function fetchIconsProgressively() {
  return async (dispatch, getState) => {
    const apps = getState().apps.list
    const iconsMap = new Map() // slug: icon
    let updateCounter = 0
    apps.forEach(async app => {
      const iconData = await _getIcon(app.iconToLoad)
      iconsMap.set(app.slug, iconData)
      updateCounter++
      if (iconsMap.size % 10 === 0 || updateCounter === apps.length) {
        const mapCopy = new Map(iconsMap)
        await dispatch({ type: RECEIVE_APPS_ICON, iconsMap: mapCopy })
        // clean already updated icons
        mapCopy.forEach((v, k) => iconsMap.delete(k))
      }
    })
  }
}

export async function getFormattedInstalledApp(
  response,
  collectLink,
  fetchIcon = true
) {
  // FIXME retro-compatibility for old formatted manifest
  response.attributes = _sanitizeOldManifest(response.attributes)

  let icon = response.links.icon
  if (fetchIcon) icon = await _getIcon(icon)
  const manifest = response.attributes
  const openingLink =
    response.attributes.type === APP_TYPE.KONNECTOR
      ? `${collectLink}/${COLLECT_RELATED_PATH}/${manifest.slug}`
      : response.links.related
  const screensLinks =
    manifest.screenshots &&
    manifest.screenshots.map(name => {
      let fileName = name
      if (fileName[0] === '/') fileName = fileName.slice(1)
      return `${cozy.client._url}/registry/${manifest.slug}/${
        manifest.version
      }/screenshots/${fileName}`
    })
  return Object.assign({}, response.attributes, {
    _id: response.id || response._id,
    // the icon fetching will done later with iconToLoad
    ...(fetchIcon ? { icon } : { iconToLoad: icon }),
    categories: _sanitizeCategories(manifest.categories),
    installed: true,
    related: openingLink,
    screenshots: screensLinks,
    uninstallable: !config.notRemovableApps.includes(response.attributes.slug)
  })
}

// only on the app initialisation
export function initApp(lang) {
  return async dispatch => {
    dispatch({ type: LOADING_APP })
    await dispatch(initializeRealtime())
    return dispatch(fetchApps(lang))
  }
}

// only on the app install intent initialisation
export function initAppIntent(lang, slug) {
  return async dispatch => {
    dispatch({ type: LOADING_APP_INTENT })
    await dispatch(initializeRealtime())
    return dispatch(fetchLatestApp(lang, slug))
  }
}

function onAppUpdate(appResponse) {
  return async (dispatch, getState) => {
    if (appResponse.state === APP_STATE.ERRORED) {
      const err = new Error('Error when installing the application')
      dispatch({ type: INSTALL_APP_FAILURE, error: err })
      throw err
    }
    if (appResponse.state === APP_STATE.READY) {
      // FIXME: hack to handle node type from stack for the konnectors
      const route =
        appResponse.type === APP_TYPE.KONNECTOR || appResponse.type === 'node'
          ? 'konnectors'
          : 'apps'
      const appFromStack = await cozy.client.fetchJSON(
        'GET',
        `/${route}/${appResponse.slug}`
      )
      // TODO throw error if collect is not installed
      const collectApp = getState().apps.list.find(a => a.slug === 'collect')
      const collectLink = collectApp && collectApp.related
      return getFormattedInstalledApp(appFromStack, collectLink).then(app => {
        // add the installed app to the state apps list
        const apps = getState().apps.list.map(a => {
          if (a.slug === app.slug) {
            return Object.assign({}, a, app, { installed: true })
          }
          return a
        })
        return dispatch({ type: INSTALL_APP_SUCCESS, apps })
      })
    }
  }
}

function onAppDelete(appResponse) {
  return async (dispatch, getState) => {
    if (appResponse.state === APP_STATE.ERRORED) {
      const err = new Error('Error when installing the application')
      dispatch({ type: UNINSTALL_APP_FAILURE, error: err })
      throw err
    }
    const apps = getState().apps.list.map(app => {
      if (app.slug === appResponse.slug) app.installed = false
      return app
    })
    return dispatch({ type: UNINSTALL_APP_SUCCESS, apps })
  }
}

function initializeRealtime() {
  return async dispatch => {
    realtime
      .subscribeAll(cozy.client, APPS_DOCTYPE)
      .then(subscription => {
        // HACK: the push CREATE at fisrt install
        subscription.onCreate(app => dispatch(onAppUpdate(app)))
        subscription.onUpdate(app => dispatch(onAppUpdate(app)))
        subscription.onDelete(app => dispatch(onAppDelete(app)))
      })
      .catch(error => {
        console.warn &&
          console.warn(`Cannot initialize realtime for apps: ${error.message}`)
      })

    realtime
      .subscribeAll(cozy.client, KONNECTORS_DOCTYPE)
      .then(subscription => {
        // HACK: the push CREATE at fisrt install
        subscription.onCreate(app => dispatch(onAppUpdate(app)))
        subscription.onUpdate(app => dispatch(onAppUpdate(app)))
        subscription.onDelete(app => dispatch(onAppDelete(app)))
      })
      .catch(error => {
        console.warn &&
          console.warn(
            `Cannot initialize realtime for konnectors: ${error.message}`
          )
      })
  }
}

export function fetchLatestApp(lang, slug, channel = DEFAULT_CHANNEL) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_APP })
    let app = getState().apps.list.find(a => a.slug === slug)
    if (!app) {
      console.warn(`No application ${slug} found in app state.`)
      app = await cozy.client.fetchJSON('GET', `/registry/${slug}`)
      if (!app) {
        return dispatch({
          type: FETCH_APP_FAILURE,
          error: new Error(`Application ${slug} not found.`)
        })
      }
    }
    return getFormattedRegistryApp(app, true, channel)
      .then(fetched => {
        // replace the new fetched app in the apps list
        return dispatch({
          type: FETCH_APP_SUCCESS,
          apps: [fetched],
          lang
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

export async function getFormattedRegistryApp(
  responseApp,
  fetchIcon = true,
  channel = DEFAULT_CHANNEL
) {
  let version = responseApp.latest_version
  if (!version) {
    version = await cozy.client.fetchJSON(
      'GET',
      `/registry/${responseApp.slug}/${channel}/latest`
    )
  }
  // FIXME retro-compatibility for old formatted manifest
  const manifest = _sanitizeOldManifest(version.manifest)
  // source is only used by the stack when installed
  // so we removed it from the app manifest if present
  if (manifest.source) delete manifest.source

  // handle locales with maintenance status and messages
  let appLocales = manifest.locales
  let maintenance = null
  if (responseApp.maintenance_activated) {
    maintenance = Object.assign({}, responseApp.maintenance_options)
    if (maintenance.messages) {
      for (let lang in maintenance.messages) {
        if (appLocales[lang]) {
          appLocales[lang].maintenance = maintenance.messages[lang]
        }
      }
      delete maintenance.messages
    }
  }

  const versionFromRegistry = version.version
  const screensLinks =
    manifest.screenshots &&
    manifest.screenshots.map(name => {
      let fileName = name
      if (fileName[0] === '/') fileName = fileName.slice(1)
      return `${cozy.client._url}/registry/${
        manifest.slug
      }/${versionFromRegistry}/screenshots/${fileName}`
    })
  const iconLink = `/registry/${manifest.slug}/${versionFromRegistry}/icon`
  let icon = iconLink
  if (fetchIcon) icon = await _getIcon(icon)
  const label =
    Number.isInteger(responseApp.label) &&
    responseApp.label <= 5 &&
    responseApp.label >= 0
      ? LABELS[responseApp.label]
      : null
  return Object.assign(
    {},
    {
      versions: responseApp.versions
    },
    manifest,
    {
      // the icon fetching will done later with iconToLoad
      ...(fetchIcon ? { icon } : { iconToLoad: icon }),
      version: versionFromRegistry,
      type: version.type,
      locales: appLocales,
      label,
      categories: _sanitizeCategories(manifest.categories),
      uninstallable: !config.notRemovableApps.includes(manifest.slug),
      isInRegistry: true,
      // handle maintenance status
      ...(maintenance ? { maintenance } : {}),
      // add screensLinks property only if it exists
      ...(screensLinks ? { screenshots: screensLinks } : {}),
      // add installed value only if not already provided
      installed: responseApp.installed || false
    }
  )
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
          return getFormattedInstalledApp(app, collectLink, false)
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
      .fetchJSON('GET', `/registry?limit=150&channelLatestVersion=${channel}`)
      .then(response => {
        const apps = response.data
          .filter(app => !config.notDisplayedApps.includes(app.slug))
          .filter(app => app.versions.dev && app.versions.dev.length) // only apps with versions available
        return Promise.all(
          apps.map(app => {
            if (!app.latest_version) return false // skip
            return getFormattedRegistryApp(app, false).catch(err => {
              console.warn(
                `Something went wrong when trying to fetch more informations about ${
                  app.slug
                } from the registry on ${channel} channel. ${err}`
              )
              return false // skip
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
  return async dispatch => {
    await dispatch(fetchRegistryApps(lang))
    return dispatch(fetchInstalledApps(lang))
  }
}

export function uninstallApp(slug, type) {
  return dispatch => {
    if (
      config.notRemovableApps.includes(slug) ||
      config.notDisplayedApps.includes(slug)
    ) {
      const error = new NotUninstallableAppException()
      dispatch({ type: UNINSTALL_APP_FAILURE, error })
    }
    dispatch({ type: UNINSTALL_APP })
    // FIXME: hack to handle node type from stack for the konnectors
    const route =
      type === APP_TYPE.KONNECTOR || type === 'node' ? 'konnectors' : 'apps'
    return cozy.client.fetchJSON('DELETE', `/${route}/${slug}`).catch(e => {
      dispatch({ type: UNINSTALL_APP_FAILURE, error: e })
    })
  }
}

export function installApp(slug, type, source, isUpdate = false) {
  return dispatch => {
    dispatch({ type: INSTALL_APP })
    const verb = isUpdate ? 'PUT' : 'POST'
    const route = type === APP_TYPE.KONNECTOR ? 'konnectors' : 'apps'
    return cozy.client
      .fetchJSON(verb, `/${route}/${slug}?Source=${encodeURIComponent(source)}`)
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
