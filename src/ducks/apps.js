/* eslint-env browser */

import { combineReducers } from 'redux'

import {
  UnavailableStackException,
  UnauthorizedStackException
} from '../lib/exceptions'

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

// Since apps ressource is not available from cozy-client-js
const STACK_DOMAIN = '//' + document.querySelector('[role=application]').dataset.cozyDomain
const STACK_TOKEN = document.querySelector('[role=application]').dataset.cozyToken

// the option credentials:include tells fetch to include the cookies in the
// request even for cross-origin requests
function fetchOptions () {
  return {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${STACK_TOKEN}`
    }
  }
}

async function getIcon (url) {
  const res = await fetch(`${STACK_DOMAIN}${url}`, fetchOptions())
  // res.text if SVG, otherwise res.blob  (mainly for safari support)
  const resClone = res.clone() // res must be cloned to be used twice
  const blob = await res.blob()
  const text = await resClone.text()

  try {
    return 'data:image/svg+xml;base64,' + btoa(text)
  } catch (e) { // eslint-disable-line
    return URL.createObjectURL(blob)
  }
}

const PLATFORM_APPS = ['settings', 'drive', 'collect']
export function fetchApps (cozyUrl, token) {
  return (dispatch, getState) => {
    dispatch({type: FETCH_MY_APPS})
    return fetch(`${STACK_DOMAIN}/apps/`, fetchOptions())
    .then(res => {
      if (res.status === 401) {
        dispatch({type: FETCH_MY_APPS_FAILURE, error: new UnauthorizedStackException()})
        throw new UnauthorizedStackException()
      }
      return res.json()
    })
    .then(json => {
      const data = json.data
      Promise.all(data.map(app => {
        return getIcon(app.links.icon)
        .then(iconData => {
          return Object.assign({}, app.attributes, {
            _id: app.id,
            icon: iconData,
            removable: !PLATFORM_APPS.includes(app.attributes.slug)
          })
        })
      }))
      .then(myApps => {
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
