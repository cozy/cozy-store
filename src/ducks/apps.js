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

export function fetchApps (cozyUrl, token) {
  return (dispatch, getState) => {
    dispatch({type: FETCH_MY_APPS})
    return fetch(`${STACK_DOMAIN}/apps/`, {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${STACK_TOKEN}`
      }
    })
    .then(res => {
      if (res.status === 401) {
        dispatch({type: FETCH_MY_APPS_FAILURE, error: new UnauthorizedStackException()})
        throw new UnauthorizedStackException()
      }
      return res.json()
    })
    .then(json => {
      const myApps = json.data
      dispatch({type: FETCH_MY_APPS_SUCCESS, myApps})
      return myApps
    })
    .catch(e => {
      dispatch({type: FETCH_MY_APPS_FAILURE, error: e})
      throw new UnavailableStackException()
    })
  }
}
