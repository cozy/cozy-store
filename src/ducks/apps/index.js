/* eslint-env browser */
/* global cozy */

import config from 'config/apps'
import CONSTANTS from 'config/constants'
import AUTHORIZED_CATEGORIES from 'config/categories'
import { NotUninstallableAppException } from '../../lib/exceptions'
import realtime from 'cozy-realtime'

export * from './selectors'
export { appsReducers } from './reducers'
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

const APPS_DOCTYPE = 'io.cozy.apps'
const KONNECTORS_DOCTYPE = 'io.cozy.konnectors'
const TERMS_DOCTYPE = 'io.cozy.terms'

const DEFAULT_CHANNEL = CONSTANTS.default.registry.channel

/* Only for the icon fetching */
let dataset
const getDataset = () => {
  if (dataset) return dataset
  const root = document.querySelector('[role=application]')
  dataset = root && root.dataset
  return dataset
}
/* Only for the icon fetching */

export const getAppIconProps = () => ({
  domain: getDataset() && getDataset().cozyDomain,
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
          return {}
        })
}

export function _getRegistryAssetsLinks(manifest, appVersion) {
  if (!appVersion && manifest) appVersion = manifest.version
  if (!appVersion) return {}
  const screenshotsLinks =
    manifest.screenshots &&
    manifest.screenshots.map(name => {
      let fileName = name
      if (fileName[0] === '/') fileName = fileName.slice(1)
      return `${cozy.client._url}/registry/${
        manifest.slug
      }/${appVersion}/screenshots/${fileName}`
    })
  const iconLink =
    manifest.slug && `/registry/${manifest.slug}/${appVersion}/icon`
  const partnershipIconLink =
    manifest.slug &&
    manifest.partnership &&
    manifest.partnership.icon &&
    `${cozy.client._url}/registry/${
      manifest.slug
    }/${appVersion}/partnership_icon`
  return {
    screenshotsLinks,
    iconLink,
    partnershipIconLink
  }
}

export async function getFormattedInstalledApp(response) {
  const appAttributes = _sanitizeManifest(response.attributes)

  const openingLink = response.links.related
  const { screenshotsLinks, partnershipIconLink } = _getRegistryAssetsLinks(
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
    return await dispatch(fetchLatestApp(lang, slug))
  }
}

function onAppUpdate(appResponse) {
  return async dispatch => {
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
      return getFormattedInstalledApp(appFromStack).then(installedApp => {
        return dispatch({ type: INSTALL_APP_SUCCESS, installedApp })
      })
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

function initializeRealtime() {
  const config = {
    token: cozy.client._token.token,
    // cozy-realtime expect an URL with an https protocol,
    // see https://github.com/cozy/cozy-libs/blob/master/packages/realtime/src/index.js#L52
    url: `${window.location.protocol}${cozy.client._url}`
  }
  return async dispatch => {
    realtime
      .subscribeAll(config, APPS_DOCTYPE)
      .then(subscription => {
        // HACK: the push CREATE at fisrt install
        subscription.onCreate(app => dispatch(onAppUpdate(app)))
        subscription.onUpdate(app => dispatch(onAppUpdate(app)))
        subscription.onDelete(app => dispatch(onAppDelete(app)))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn(`Cannot initialize realtime for apps: ${error.message}`)
      })

    realtime
      .subscribeAll(config, KONNECTORS_DOCTYPE)
      .then(subscription => {
        // HACK: the push CREATE at fisrt install
        subscription.onCreate(app => dispatch(onAppUpdate(app)))
        subscription.onUpdate(app => dispatch(onAppUpdate(app)))
        subscription.onDelete(app => dispatch(onAppDelete(app)))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn(
          `Cannot initialize realtime for konnectors: ${error.message}`
        )
      })
  }
}

async function _getInstalledInfos(app) {
  try {
    let installedApp = await cozy.client.fetchJSON(
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
      app = await cozy.client.fetchJSON(
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
      const formattedApp = await getFormattedRegistryApp(app, channel)
      formattedApp.installed = await _getInstalledInfos(app)
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
  responseApp,
  channel = DEFAULT_CHANNEL
) {
  let version = responseApp.latest_version
  if (!version) {
    version = await cozy.client.fetchJSON(
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
  } = _getRegistryAssetsLinks(manifest, versionFromRegistry)
  const partnership =
    !!manifest.partnership &&
    Object.assign({}, manifest.partnership, {
      ...(partnershipIconLink ? { icon: partnershipIconLink } : {})
    })
  return Object.assign(
    {},
    {
      versions: responseApp.versions
    },
    manifest,
    {
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
        w.attributes.type = APP_TYPE.WEBAPP
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
        k.attributes.type = APP_TYPE.KONNECTOR
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
      .fetchJSON(
        'GET',
        `/registry?limit=200&versionsChannel=${channel}&latestChannelVersion=${channel}`
      )
      .then(response => {
        const apps = response.data
          .filter(app => !config.notDisplayedApps.includes(app.slug))
          .filter(app => app.versions[channel] && app.versions[channel].length) // only apps with versions available
        return Promise.all(
          apps.map(app => {
            // no latest_version means no version for this channel
            if (!app.latest_version) return false // skip
            return getFormattedRegistryApp(app).catch(err => {
              console.warn(
                `Something went wrong when trying to fetch more informations about ${
                  app.slug
                } from the registry on ${channel} channel. ${err}`
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

export function fetchApps(lang) {
  return async dispatch => {
    await dispatch(fetchRegistryApps(lang))
    return dispatch(fetchInstalledApps(lang))
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

export function uninstallApp(app) {
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
    return cozy.client.fetchJSON('DELETE', `/${route}/${slug}`).catch(e => {
      dispatch({ type: UNINSTALL_APP_FAILURE, error: extractJsonApiError(e) })
    })
  }
}

let termsIndexCache = null
async function _getOrCreateTermsIndex() {
  termsIndexCache = await cozy.client.data.defineIndex(TERMS_DOCTYPE, [
    'termsId',
    'version'
  ])
  return termsIndexCache
}

async function _saveAppTerms(terms) {
  const { id, ...termsAttributes } = terms
  // We use : as separator for <id>:<version>
  let savedTermsDocs = null
  try {
    savedTermsDocs = await cozy.client.data.query(
      await _getOrCreateTermsIndex(),
      {
        selector: {
          termsId: id,
          version: termsAttributes.version
        },
        limit: 1
      }
    )
  } catch (e) {
    throw e
  }
  if (savedTermsDocs && savedTermsDocs.length) {
    // we just update the url if this is the same id and same version
    // but the url changed
    const savedTerms = savedTermsDocs[0]
    if (
      savedTerms.termsId == id &&
      savedTerms.version == termsAttributes.version &&
      savedTerms.url != termsAttributes.url
    ) {
      await cozy.client.data.updateAttributes(TERMS_DOCTYPE, savedTerms._id, {
        url: termsAttributes.url
      })
    }
  } else {
    const termsToSave = Object.assign({}, termsAttributes, {
      termsId: id,
      accepted: true,
      acceptedAt: new Date()
    })
    await cozy.client.data.create(TERMS_DOCTYPE, termsToSave)
  }
}

export function installApp(app, source, isUpdate = false) {
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
        await _saveAppTerms(terms)
      } catch (e) {
        handleError(e)
      }
    }
    const verb = isUpdate ? 'PUT' : 'POST'
    const route = type === APP_TYPE.KONNECTOR ? 'konnectors' : 'apps'
    try {
      await cozy.client.fetchJSON(verb, `/${route}/${slug}?${queryString}`)
    } catch (e) {
      handleError(e)
    }
  }
}

export function installAppFromRegistry(
  app,
  channel = DEFAULT_CHANNEL,
  isUpdate = false
) {
  return dispatch => {
    const source = `registry://${app.slug}/${channel}`
    return dispatch(installApp(app, source, isUpdate))
  }
}
