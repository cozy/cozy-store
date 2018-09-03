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
    const component = shallow(<MyApplications store={store} />)
      .dive()
      .getElement()
    expect(component).toMatchSnapshot()
  })

  it('Discover should be rendered correctly at initial store', () => {
    const store = mockStore(initialState)
    const component = shallow(<Discover store={store} />)
      .dive()
      .getElement()
    expect(component).toMatchSnapshot()
  })
})
