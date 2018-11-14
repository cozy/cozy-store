'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import {
  AppsLoading,
  LoadingAppsComponents
} from 'ducks/components/AppsLoading'

global.Math.random = () => 1 // remove random for testing

describe('AppsLoading component', () => {
  it('should be rendered correctly and never be updated', () => {
    const wrapper = shallow(<AppsLoading />)
    const shouldUpdate = wrapper.instance().shouldComponentUpdate()
    expect(shouldUpdate).toBe(false)
  })
})

describe('LoadingAppsComponents component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <LoadingAppsComponents count={3} subKey="mock" />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly if isMobile', () => {
    const component = shallow(
      <LoadingAppsComponents
        count={3}
        subKey="mock"
        breakpoints={{ isMobile: true }}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
