'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { App } from '../src/ducks/components/App'

describe('App component only', () => {
  it('should be mounted correctly', () => {
    const initApp = jest.fn()
    const component = shallow(<App initApp={initApp} />).getElement()
    expect(component).toMatchSnapshot()
    expect(initApp.mock.calls.length).toBe(1)
  })
})
