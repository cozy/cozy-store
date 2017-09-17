'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'

import { MyApplications, Discover } from '../../../src/ducks/apps/Containers'
import { InstallModal } from '../../../src/ducks/apps/currentAppVersion/Containers'

const mockStore = configureStore()

describe('Apps Containers (connected components):', () => {
  const initialState = {
    apps: {
      list: [],
      isFetching: false,
      isInstalling: false,
      actionError: null,
      fetchError: null
    }
  }

  it('MyApplications should be rendered correctly at initial store', () => {
    const store = mockStore(initialState)
    const component = shallow(
      <MyApplications store={store} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('Discover should be rendered correctly at initial store', () => {
    const store = mockStore(initialState)
    const component = shallow(
      <Discover store={store} />
    ).node
    expect(component).toMatchSnapshot()
  })
})

describe('currentAppVersion Containers (connected components):', () => {
  const initialState = {
    currentAppVersion: {
      version: null,
      isFetching: false,
      error: null
    }
  }

  it('InstallModal should be rendered correctly at initial store', () => {
    const store = mockStore(initialState)
    const component = shallow(
      <InstallModal store={store} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
