'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { ScrollToTop } from 'ducks/components/ScrollToTop'

const mockNode = document.createElement('div')
mockNode.scrollTo = jest.fn()
const mockRef = {
  getDOMNode: () => mockNode
}
const getBreakpoints = (isDesktop = true) => ({
  isDesktop
})

describe('ScrollToTop component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call scrollTo of the target on update with location change', () => {
    expect(mockNode.scrollTo.mock.calls.length).toBe(0)
    const wrapper = shallow(
      <ScrollToTop
        breakpoints={getBreakpoints()}
        target={mockRef}
        location={'/myapps'}
      />
    )
    wrapper.setProps({ location: '/discover' })
    expect(mockNode.scrollTo.mock.calls.length).toBe(1)
    expect(mockNode.scrollTo.mock.calls[0][0]).toBe(0)
    expect(mockNode.scrollTo.mock.calls[0][1]).toBe(0)
  })

  it('should not call scrollTo of the target on update without location change', () => {
    expect(mockNode.scrollTo.mock.calls.length).toBe(0)
    const wrapper = shallow(
      <ScrollToTop
        breakpoints={getBreakpoints()}
        target={mockRef}
        location={'/myapps'}
        mockProp="1"
      />
    )
    wrapper.setProps({ mockProp: '2' })
    expect(mockNode.scrollTo.mock.calls.length).toBe(0)
  })

  it('should call scrollTo of the documentElement if this not desktop view', () => {
    document.documentElement.scrollTo = jest.fn()
    expect(document.documentElement.scrollTo.mock.calls.length).toBe(0)
    const wrapper = shallow(
      <ScrollToTop
        breakpoints={getBreakpoints(false)}
        target={mockRef}
        location={'/myapps'}
      />
    )
    wrapper.setProps({ location: '/discover' })
    expect(document.documentElement.scrollTo.mock.calls.length).toBe(1)
    expect(document.documentElement.scrollTo.mock.calls[0][0]).toBe(0)
    expect(document.documentElement.scrollTo.mock.calls[0][1]).toBe(0)
  })
})
