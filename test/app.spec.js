'use strict'

/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'

import {
  App,
  mapStateToProps,
  mapDispatchToProps
} from '../src/ducks/components/App'

describe('App component only', () => {
  it('should be mounted correctly', () => {
    const initApp = jest.fn()
    const component = shallow(<App initApp={initApp} />).getElement()
    expect(component).toMatchSnapshot()
    expect(initApp.mock.calls.length).toBe(1)
  })

  it('should export mapStateToProps and mapDispatchToProps to allow customization', () => {
    expect(typeof mapStateToProps).toBe('function')
    expect(typeof mapDispatchToProps).toBe('function')
  })
})
