/* eslint-env browser */
/* global cozy */

import { combineReducers } from 'redux'

import {
  UnavailableStackException
} from '../../lib/exceptions'

const FETCH_MY_APPS = 'FETCH_MY_APPS'
const FETCH_MY_APPS_SUCCESS = 'FETCH_MY_APPS_SUCCESS'
const FETCH_MY_APPS_FAILURE = 'FETCH_MY_APPS_FAILURE'

const list = (state = [], action) => {
  switch (action.type) {
    case FETCH_MY_APPS_SUCCESS:
      return action.myApps
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_MY_APPS:
      return true
    case FETCH_MY_APPS_SUCCESS:
    case FETCH_MY_APPS_FAILURE:
      return false
    default:
      return state
  }
}

export const error = (state = null, action) => {
  switch (action.type) {
    case FETCH_MY_APPS_FAILURE:
      return action.error
    default:
      return state
  }
}

export const myAppsReducers = combineReducers({
  list,
  error,
  isFetching
})

async function getIcon (url) {
  const icon = await cozy.client.fetchJSON('GET', url)

  try {
    return 'data:image/svg+xml;base64,' + btoa(icon)
  } catch (e) { // eslint-disable-line
    return URL.createObjectURL(icon)
  }
}

const NOT_REMOVABLE_APPS = ['drive', 'collect']
const NOT_DISPLAYED_APPS = ['settings', 'store', 'onboarding']
export function fetchApps () {
  return (dispatch, getState) => {
    dispatch({type: FETCH_MY_APPS})
    return cozy.client.fetchJSON('GET', '/apps/')
    .then(apps => {
      Promise.all(apps.map(app => {
        return getIcon(app.links.icon)
        .then(iconData => {
          return Object.assign({}, app.attributes, {
            _id: app.id,
            icon: iconData,
            uninstallable: !NOT_REMOVABLE_APPS.includes(app.attributes.slug)
          })
        })
      }))
      .then(myApps => {
        myApps = myApps.filter(app => !NOT_DISPLAYED_APPS.includes(app.slug))
        dispatch({type: FETCH_MY_APPS_SUCCESS, myApps})
        return myApps
      })
    })
    .catch(e => {
      dispatch({type: FETCH_MY_APPS_FAILURE, error: e})
      throw new UnavailableStackException()
    })
  }
}

export function uninstallApp (slug) {
  return (dispatch, getState) => {
    return cozy.client.fetchJSON('DELETE', `/apps/${slug}`)
    .then(() => {
      return dispatch({
        type: 'SEND_LOG_SUCCESS',
        alert: {
          message: 'app_modal.uninstall.message.success',
          level: 'success'
        }
      })
    })
    .catch(e => {
      dispatch({type: FETCH_MY_APPS_FAILURE, error: e})
      throw new UnavailableStackException()
    })
  }
}
