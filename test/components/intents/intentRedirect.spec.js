'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { useLocation } from 'react-router-dom'

import { IntentRedirect } from 'ducks/components/intents/IntentRedirect'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}))

describe('IntentRedirect component', () => {
  it('should be rendered correctly if url search provided', () => {
    useLocation.mockReturnValue({ search: '?doctype=io.cozy.apps' })
    const component = shallow(<IntentRedirect />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly if search for slug', () => {
    useLocation.mockReturnValue({ search: '?slug=mock' })
    const component = shallow(<IntentRedirect />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle search param without value', () => {
    useLocation.mockReturnValue({ search: '?slug=mock&doctype' })
    const component = shallow(<IntentRedirect />).getElement()
    expect(component).toMatchSnapshot()
  })
})
