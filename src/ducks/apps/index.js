/* eslint-env browser */

import flatten from 'lodash/flatten'

import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import CozyRealtime from 'cozy-realtime'

import {
  fetchUserApps,
  fetchAppsFromChannel,
  fetchAppOrKonnector
} from './client-helpers'
import { APP_TYPE, APP_STATE, REGISTRY_CHANNELS } from './constants'
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
  SAVE_APP
} from './reducers'
import termUtils from './terms'

import config from '@/config/apps.json'
import AUTHORIZED_CATEGORIES from '@/config/categories.json'
import storeConfig from '@/config/index.json'
import { NotUninstallableAppException } from '@/lib/exceptions'

export { APP_STATE }
export { APP_TYPE }
export { REGISTRY_CHANNELS }
export * from '@/ducks/apps/selectors'
export { appsReducers } from '@/ducks/apps/reducers'

const APPS_DOCTYPE = 'io.cozy.apps'
const KONNECTORS_DOCTYPE = 'io.cozy.konnectors'

const DEFAULT_CHANNEL = storeConfig.default.registry.channel

/* Only for the icon fetching */
let dataset
const getDataset = () => {
  if (dataset) return dataset
  const root = document.querySelector('[role=application]')
  dataset = root && JSON.parse(root.dataset.cozy)
  return dataset
}

const shouldAppBeDisplayed = appAttributes => {
  const excludedAppsByFlag = flag('apps.hidden') || []
  return (
    !config.notDisplayedApps.includes(appAttributes.slug) &&
    !excludedAppsByFlag.includes(appAttributes.slug)
  )
}

/* Only for the icon fetching */
export const getAppIconProps = () => ({
  domain: getDataset() && getDataset().domain,
  secure: window.location.protocol === 'https:'
})

export function _sanitizeManifest(app) {
  // FIXME retro-compatibility for old formatted manifest
  const sanitized = Object.assign({}, app)
  if (!app.categories && app.category && typeof app.category === 'string') {
    sanitized.categories = [app.category]
    delete sanitized.category
  }
  if (typeof app.name === 'object') sanitized.name = app.name.en
  // FIXME use camelCase from cozy-stack
  if (app.available_version) {
    sanitized.availableVersion = app.available_version
    delete sanitized.available_version
  }
  // remove incomplete or empty terms
  const hasValidTerms =
    !!sanitized.terms &&
    !!sanitized.terms.id &&
    !!sanitized.terms.url &&
    !!sanitized.terms.version
  if (sanitized.terms && !hasValidTerms) delete sanitized.terms
  // remove incomplete or empty partnership
  const hasValidPartnership =
    !!sanitized.partnership && !!sanitized.partnership.description
  if (sanitized.partnership && !hasValidPartnership)
    delete sanitized.partnership
  return sanitized
}

// check authorized categories and add default 'others'
export function _sanitizeCategories(categoriesList) {
  if (!categoriesList) return ['others']
  const filteredList = categoriesList.filter(c =>
    AUTHORIZED_CATEGORIES.includes(c)
  )
  if (!filteredList.length) return ['others']
  return filteredList
}

let contextCache
export function getContext(client) {
  return contextCache
    ? Promise.resolve(contextCache)
    : client.stackClient
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
          return {}
        })
}
getContext.clearCache = () => {
  contextCache = null
}

export function _getRegistryAssetsLinks(client, manifest, appVersion) {
  if (!appVersion && manifest) appVersion = manifest.version
  if (!appVersion) return {}
  const screenshotsLinks =
    manifest.screenshots &&
    manifest.screenshots.map(name => {
      let fileName = name
      if (fileName[0] === '/') fileName = fileName.slice(1)
      return `${client.stackClient.uri}/registry/${manifest.slug}/${appVersion}/screenshots/${fileName}`
    })
  const iconLink =
    manifest.slug && `/registry/${manifest.slug}/${appVersion}/icon`
  const partnershipIconLink =
    manifest.slug &&
    manifest.partnership &&
    manifest.partnership.icon &&
    `${client.stackClient.uri}/registry/${manifest.slug}/${appVersion}/partnership_icon`
  return {
    screenshotsLinks,
    iconLink,
    partnershipIconLink
  }
}

export function getFormattedInstalledApp(client, response) {
  const appAttributes = _sanitizeManifest(response.attributes)

  const openingLink = response.links.related
  const { screenshotsLinks, partnershipIconLink } = _getRegistryAssetsLinks(
    client,
    appAttributes,
    appAttributes.version
  )
  const partnership =
    !!appAttributes.partnership &&
    Object.assign({}, appAttributes.partnership, {
      ...(partnershipIconLink ? { icon: partnershipIconLink } : {})
    })
  return Object.assign({}, appAttributes, {
    _id: response.id || response._id,
    categories: _sanitizeCategories(appAttributes.categories),
    installed: true,
    related: openingLink,
    links: response.links,
    // Add partnership property only if it exists
    ...(partnership ? { partnership } : {}),
    // add screenshotsLinks property only if it exists
    ...(screenshotsLinks ? { screenshots: screenshotsLinks } : {}),
    uninstallable: !config.notRemovableApps.includes(appAttributes.slug)
  })
}

// only on the app initialisation
export function initApp(client, lang) {
  return dispatch => {
    dispatch({ type: LOADING_APP })
    dispatch(initializeRealtime(client))
    return dispatch(fetchApps(client, lang))
  }
}

// only on the app install intent initialisation
export function initAppIntent(client, lang, slug) {
  return async dispatch => {
    dispatch({ type: LOADING_APP_INTENT })
    dispatch(initializeRealtime(client))
    return await dispatch(fetchLatestApp(client, lang, slug))
  }
}

function onAppUpdate(client, appResponse) {
  return async dispatch => {
    if (appResponse.state === APP_STATE.ERRORED) {
      const err = new Error('Error when installing the application')
      dispatch({ type: INSTALL_APP_FAILURE, error: err })
      throw err
    }
    if (appResponse.state === APP_STATE.READY) {
      // FIXME: hack to handle node type from stack for the konnectors
      const appFromStack = await fetchAppOrKonnector(
        client,
        appResponse.type,
        appResponse.slug
      )
      const installedApp = getFormattedInstalledApp(client, appFromStack)
      return dispatch({ type: INSTALL_APP_SUCCESS, installedApp })
    }
  }
}

function onAppDelete(appResponse) {
  return async dispatch => {
    if (appResponse.state === APP_STATE.ERRORED) {
      const err = new Error('Error when installing the application')
      dispatch({ type: UNINSTALL_APP_FAILURE, error: err })
      throw err
    }
    const { slug } = appResponse
    return dispatch({ type: UNINSTALL_APP_SUCCESS, slug })
  }
}

function initializeRealtime(client) {
  const realtime = new CozyRealtime({ client })
  return dispatch => {
    const handleAppUpdate = app => dispatch(onAppUpdate(client, app))
    const handleAppDelete = app => dispatch(onAppDelete(app))

    for (let doctype of [APPS_DOCTYPE, KONNECTORS_DOCTYPE]) {
      try {
        realtime.subscribe('created', doctype, handleAppUpdate)
        realtime.subscribe('updated', doctype, handleAppUpdate)
        realtime.subscribe('deleted', doctype, handleAppDelete)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          `Cannot initialize realtime for ${doctype}: ${error.message}`
        )
      }
    }
  }
}

async function _getInstalledInfos(client, app) {
  try {
    let installedApp = await client.stackClient.fetchJSON(
      'GET',
      `/${app.type === APP_TYPE.WEBAPP ? 'apps' : 'konnectors'}/${app.slug}`
    )
    return !!installedApp
  } catch (e) {
    return false
  }
}

/* Restore a previous saved app state into the apps list */
export function restoreAppIfSaved() {
  return async (dispatch, getState) => {
    const savedApp = getState().apps.savedApp
    if (savedApp && getState().apps.isInstalling !== savedApp.slug)
      dispatch({ type: RESTORE_APP, app: savedApp })
  }
}

export function fetchLatestApp(
  client,
  lang,
  slug,
  channel = DEFAULT_CHANNEL,
  appToSave = null // if provided, we store it into savedApp state
) {
  return async (dispatch, getState) => {
    if (appToSave) dispatch({ type: SAVE_APP, app: appToSave })
    dispatch({ type: FETCH_APP })
    let app = getState().apps.list.find(a => a.slug === slug)
    try {
      // TODO check if possible to do via fetchAppsFromChannel
      app = await client.stackClient.fetchJSON(
        'GET',
        `/registry/${slug}?latestChannelVersion=${channel}`
      )
    } catch (err) {
      let errorMessage = `Error while getting the application with slug: ${slug}`
      if (err.status === 404) {
        errorMessage = `Application ${slug} not found in the registry.`
      }
      return dispatch({
        type: FETCH_APP_FAILURE,
        error: new Error(errorMessage)
      })
    }
    try {
      const formattedApp = await getFormattedRegistryApp(client, app, channel)
      formattedApp.installed = await _getInstalledInfos(client, app)
      // dispatch the app only if we are still in fetching status
      // (meant that the fetch has not been cancelled by a RESTORE_APP action)
      if (getState().apps.isAppFetching) {
        dispatch({
          type: FETCH_APP_SUCCESS,
          app: formattedApp,
          lang
        })
      }
      return formattedApp
    } catch (err) {
      if (err.status === 404) {
        // eslint-disable-next-line no-console
        console.warn(
          `No ${channel} version found for ${slug} from the registry.`
        )
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `Something went wrong when trying to fetch more informations about ${slug} from the registry on ${channel} channel. ${err}`
        )
      }
      dispatch({ type: FETCH_APP_FAILURE, error: err })
      throw err
    }
  }
}

export async function getFormattedRegistryApp(
  client,
  responseApp,
  channel = DEFAULT_CHANNEL
) {
  let version = responseApp.latest_version
  if (!version) {
    version = await client.stackClient.fetchJSON(
      'GET',
      `/registry/${responseApp.slug}/${channel}/latest`
    )
  }
  const manifest = _sanitizeManifest(version.manifest)
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
  const {
    screenshotsLinks,
    iconLink,
    partnershipIconLink
  } = _getRegistryAssetsLinks(client, manifest, versionFromRegistry)
  const partnership =
    !!manifest.partnership &&
    Object.assign({}, manifest.partnership, {
      ...(partnershipIconLink ? { icon: partnershipIconLink } : {})
    })
  return Object.assign({}, manifest, {
    versions: responseApp.versions,
    label: responseApp.label,
    version: versionFromRegistry,
    type: version.type,
    categories: _sanitizeCategories(manifest.categories),
    links: { icon: iconLink },
    uninstallable: !config.notRemovableApps.includes(manifest.slug),
    isInRegistry: true,
    // Add partnership property only if it exists
    ...(partnership ? { partnership } : {}),
    // handle maintenance status
    ...(maintenance ? { maintenance } : {}),
    // add screenshotsLinks property only if it exists
    ...(screenshotsLinks ? { screenshots: screenshotsLinks } : {}),
    // add installed value only if not already provided
    installed: responseApp.installed || false
  })
}

export function fetchInstalledApps(client, lang, fetchingRegistry) {
  return async dispatch => {
    const { filterAppType } = storeConfig
    try {
      // Start the HTTP requests as soon as possible
      const toFetch = [APP_TYPE.KONNECTOR, APP_TYPE.WEBAPP].filter(
        type => !filterAppType || type === filterAppType
      )
      const promises = toFetch.map(type => fetchUserApps(client, type))
      await fetchingRegistry
      dispatch({ type: FETCH_APPS })
      const installedApps = flatten(await Promise.all(promises)).filter(x =>
        shouldAppBeDisplayed(x.attributes)
      )
      const apps = installedApps.map(app =>
        getFormattedInstalledApp(client, app)
      )
      dispatch({ type: FETCH_APPS_SUCCESS, apps, lang })
    } catch (e) {
      dispatch({ type: FETCH_APPS_FAILURE, error: e })
      throw e
    }
  }
}

export function fetchRegistryApps(client, lang, channel = DEFAULT_CHANNEL) {
  return dispatch => {
    dispatch({ type: FETCH_APPS })
    return fetchAppsFromChannel(client, channel, storeConfig.filterAppType)
      .then(response => {
        const apps = response.data
          .filter(shouldAppBeDisplayed)
          .filter(app => app.versions[channel] && app.versions[channel].length) // only apps with versions available
        return Promise.all(
          apps.map(app => {
            // no latest_version means no version for this channel
            if (!app.latest_version) return false // skip
            return getFormattedRegistryApp(client, app).catch(err => {
              // eslint-disable-next-line no-console
              console.warn(
                `Something went wrong when trying to fetch more informations about ${app.slug} from the registry on ${channel} channel. ${err}`
              )
              return false // skip
            })
          })
        ).then(apps => {
          return dispatch({
            type: FETCH_REGISTRY_APPS_SUCCESS,
            apps: apps.filter(a => a),
            lang
          })
        })
      })
      .catch(e => {
        dispatch({ type: FETCH_APPS_FAILURE, error: e })
        throw e
      })
  }
}

export function fetchApps(client, lang) {
  return async dispatch => {
    const fetchingRegistry = dispatch(fetchRegistryApps(client, lang))
    return dispatch(fetchInstalledApps(client, lang, fetchingRegistry))
  }
}

function extractJsonApiError(e) {
  try {
    const parsed = JSON.parse(e.message)
    return new Error(parsed.errors[0].detail || e.message)
  } catch (err) {
    return e
  }
}

export function uninstallApp(client, app) {
  const { slug, type } = app
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
    return client.stackClient
      .fetchJSON('DELETE', `/${route}/${slug}`)
      .catch(e => {
        dispatch({ type: UNINSTALL_APP_FAILURE, error: extractJsonApiError(e) })
      })
  }
}

export function installApp(client, app, source, isUpdate = false) {
  const { slug, type, terms } = app
  return async dispatch => {
    dispatch({ type: INSTALL_APP, slug })
    const handleError = e => {
      dispatch({ type: INSTALL_APP_FAILURE, error: e })
      throw e
    }
    const args = {}
    if (isUpdate) args.PermissionsAcked = isUpdate
    if (source) args.Source = source
    const queryString = Object.keys(args)
      .map(k => k + '=' + args[k])
      .join('&')
    if (terms) {
      try {
        await termUtils.save(client, terms)
      } catch (e) {
        handleError(e)
      }
    }
    const verb = isUpdate ? 'PUT' : 'POST'
    const route = type === APP_TYPE.KONNECTOR ? 'konnectors' : 'apps'
    try {
      await client.stackClient.fetchJSON(
        verb,
        `/${route}/${slug}?${queryString}`
      )
    } catch (e) {
      handleError(e)
    }
  }
}

export function installAppFromRegistry(
  client,
  app,
  channel = DEFAULT_CHANNEL,
  isUpdate = false
) {
  return dispatch => {
    const source = `registry://${app.slug}/${channel}`
    return dispatch(installApp(client, app, source, isUpdate))
  }
}

export const openApp = (webviewIntent, app) => {
  if (isFlagshipApp()) {
    webviewIntent.call('openApp', app.related, app)
  } else {
    window.location.assign(app.related)
  }
}
