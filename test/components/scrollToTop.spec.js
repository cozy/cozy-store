'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { ScrollToTop } from 'ducks/components/ScrollToTop'

const mockNode = document.createElement('div')
jest.mock('react-dom', () => ({
  findDOMNode: () => mockNode
}))
const getBreakpoints = (isDesktop = true) => ({
  isDesktop
})

describe('ScrollToTop component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockNode.scrollTop = null
  })

  it('should call scrollTo of the target on update with location change', () => {
    const wrapper = shallow(
      <ScrollToTop
        breakpoints={getBreakpoints()}
        target={mockNode}
        location={'/myapps'}
      />
    )
    mockNode.scrollTop = 200
    expect(mockNode.scrollTop).toBe(200)
    wrapper.setProps({ location: '/discover' })
    expect(mockNode.scrollTop).toBe(0)
  })

  it('should not call scrollTo of the target on update without location change', () => {
    const wrapper = shallow(
      <ScrollToTop
        breakpoints={getBreakpoints()}
        target={mockNode}
        location={'/myapps'}
        mockProp="1"
      />
    )
    mockNode.scrollTop = 200
    expect(mockNode.scrollTop).toBe(200)
    wrapper.setProps({ mockProp: '2' })
    expect(mockNode.scrollTop).toBe(200)
  })

  it('should call scrollTo of the documentElement if this not desktop view', () => {
    const wrapper = shallow(
      <ScrollToTop
        breakpoints={getBreakpoints(false)}
        target={mockNode}
        location={'/myapps'}
      />
    )
    document.documentElement.scrollTop = 200
    document.body.scrollTop = 200
    expect(document.documentElement.scrollTop).toBe(200)
    expect(document.body.scrollTop).toBe(200)
    wrapper.setProps({ location: '/discover' })
    expect(document.documentElement.scrollTop).toBe(0)
    expect(document.body.scrollTop).toBe(0)
  })
})
