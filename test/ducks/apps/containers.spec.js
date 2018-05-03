'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import { MyApplications, Discover } from 'ducks/apps/Containers'

Enzyme.configure({ adapter: new Adapter() })

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
    const component = shallow(<MyApplications store={store} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('Discover should be rendered correctly at initial store', () => {
    const store = mockStore(initialState)
    const component = shallow(<Discover store={store} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
