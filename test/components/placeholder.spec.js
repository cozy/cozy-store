'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import Placeholder from 'ducks/components/Placeholder'

global.Math.random = () => 1 // remove random for testing

describe('Placeholder component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <Placeholder width="5rem" height="3rem" />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with autoMargin option', () => {
    const component = shallow(
      <Placeholder width="5rem" height="3rem" autoMargin />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with interval of widths', () => {
    const component = shallow(
      <Placeholder width={[3, 5]} height="3rem" autoMargin />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
