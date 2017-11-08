'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'

import { MyApplications, Discover } from 'ducks/apps/Containers'

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

  const propsToTest = ['fetchApps', 'fetchInstalledApps', 'installApp', 'uninstallApp']

  propsToTest.map(name => {
    it(`MyApplications should dispatch one action on ${name}`, () => {
      const store = mockStore(initialState)
      store.dispatch = jest.fn(() => Promise.resolve())
      const component = shallow(
        <MyApplications store={store} />
      )
      component.props()[name]()
      expect(store.dispatch.mock.calls.length).toBe(1)
      expect(store.dispatch.mock.calls[0][0]).toBeInstanceOf(Function)
    })
  })

  propsToTest.map(name => {
    it(`Discover should dispatch one action on ${name}`, () => {
      const store = mockStore(initialState)
      store.dispatch = jest.fn(() => Promise.resolve())
      const component = shallow(
        <Discover store={store} />
      )
      component.props()[name]()
      expect(store.dispatch.mock.calls.length).toBe(1)
      expect(store.dispatch.mock.calls[0][0]).toBeInstanceOf(Function)
    })
  })
})
