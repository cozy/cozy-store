'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ScrollToTop } from 'ducks/components/ScrollToTop'

Enzyme.configure({ adapter: new Adapter() })

const mockNode = document.createElement('div')
mockNode.scrollTo = jest.fn()
const mockRef = {
  getDOMNode: () => mockNode
}

describe('ScrollToTop component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call scrollTo of the target on update with location change', () => {
    expect(mockNode.scrollTo.mock.calls.length).toBe(0)
    const wrapper = shallow(
      <ScrollToTop target={mockRef} location={'/myapps'} />
    )
    wrapper.setProps({ location: '/discover' })
    expect(mockNode.scrollTo.mock.calls.length).toBe(1)
    expect(mockNode.scrollTo.mock.calls[0][0]).toBe(0)
    expect(mockNode.scrollTo.mock.calls[0][1]).toBe(0)
  })

  it('should not call scrollTo of the target on update without location change', () => {
    expect(mockNode.scrollTo.mock.calls.length).toBe(0)
    const wrapper = shallow(
      <ScrollToTop target={mockRef} location={'/myapps'} mockProp="1" />
    )
    wrapper.setProps({ mockProp: '2' })
    expect(mockNode.scrollTo.mock.calls.length).toBe(0)
  })
})
