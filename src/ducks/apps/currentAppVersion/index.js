/* eslint-env browser */
/* global cozy */

import { combineReducers } from 'redux'

import {
  UnavailableRegistryException,
  NotFoundException
} from '../../../lib/exceptions'

const FETCH_APP_VERSION = 'FETCH_APP_VERSION'
const FETCH_APP_VERSION_SUCCESS = 'FETCH_APP_VERSION_SUCCESS'
const FETCH_APP_VERSION_FAILURE = 'FETCH_APP_VERSION_FAILURE'

export const version = (state = null, action) => {
  switch (action.type) {
    case FETCH_APP_VERSION_SUCCESS:
      return action.version
    default:
      return state
  }
}

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_APP_VERSION:
      return true
    case FETCH_APP_VERSION_SUCCESS:
    case FETCH_APP_VERSION_FAILURE:
      return false
    default:
      return state
  }
}

export const error = (state = null, action) => {
  switch (action.type) {
    case FETCH_APP_VERSION_FAILURE:
      return action.error
    default:
      return state
  }
}

export const currentAppVersionReducers = combineReducers({
  version,
  error,
  isFetching
})

export function fetchLastAppVersion (appSlug, channel = 'stable') {
  return (dispatch, getState) => {
    dispatch({type: FETCH_APP_VERSION})
    return cozy.client.fetchJSON('GET', `/registry/${appSlug}/${channel}/latest`)
    .then(version => {
      const versionFromRegistry = version.version
      const manifest = version.manifest
      const screensLinks = manifest.screenshots && manifest.screenshots.map(name => {
        const fileName = name.replace(/^.*[\\/]/, '')
        return `${cozy.client._url}/registry/${manifest.slug}/${versionFromRegistry}/screenshots/${fileName}`
      })
      const iconLink = `${cozy.client._url}/registry/${manifest.slug}/${versionFromRegistry}/icon`
      return dispatch({
        type: FETCH_APP_VERSION_SUCCESS,
        version: Object.assign({}, version, {
          manifest: Object.assign({}, manifest, {
            screenshots: screensLinks,
            icon: iconLink
          })
        })
      })
    })
    .catch(error => {
      let registryError = new UnavailableRegistryException()
      if (error.status === 404) registryError = new NotFoundException()
      dispatch({type: FETCH_APP_VERSION_FAILURE, error: registryError})
      console.error(error)
    })
  }
}
