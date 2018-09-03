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

  it('should fetch app icons after first fetching', () => {
    const fetchIconsProgressively = jest.fn()
    const initApp = jest.fn()
    const wrapper = shallow(
      <App
        initApp={initApp}
        fetchIconsProgressively={fetchIconsProgressively}
        isFetching={true}
      />
    )
    expect(initApp.mock.calls.length).toBe(1)
    expect(fetchIconsProgressively.mock.calls.length).toBe(0)
    // only fetch icons if isFetching value changes
    wrapper.setProps({ initApp: () => jest.fn() })
    expect(fetchIconsProgressively.mock.calls.length).toBe(0)
    wrapper.setProps({ isFetching: false })
    expect(wrapper.getElement()).toMatchSnapshot()
    expect(fetchIconsProgressively.mock.calls.length).toBe(1)
  })
})
