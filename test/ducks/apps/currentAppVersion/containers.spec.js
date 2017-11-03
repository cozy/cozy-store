'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'

import { InstallModal } from 'ducks/apps/currentAppVersion/Containers'

const mockStore = configureStore()

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

  it('InstallModal should dispatch one action on fetchLastAppVersion', () => {
    const store = mockStore(initialState)
    store.dispatch = jest.fn(() => Promise.resolve())
    const component = shallow(
      <InstallModal store={store} />
    )
    component.props().fetchLastAppVersion()
    expect(store.dispatch.mock.calls.length).toBe(1)
    expect(store.dispatch.mock.calls[0][0]).toBeInstanceOf(Function)
  })
})
