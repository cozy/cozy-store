'use strict'

/* eslint-env jest */

import { ConfigureRoute } from 'ducks/apps/components/ApplicationRouting/ConfigureRoute'
import { shallow } from 'enzyme'
import React from 'react'
import { useParams } from 'react-router-dom'

import mockApps from '../../_mockApps'

const getAppMock = ({ params }) => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn(() => null)
})

jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}))

describe('ConfigureRoute component', () => {
  it('should display nothing if isFetching', () => {
    // collect in mockApps is installed and isInRegistry
    useParams.mockReturnValue({ appSlug: 'collect' })
    const props = getProps(true)
    const component = shallow(<ConfigureRoute {...props} />)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo parent if no app/konnector found', () => {
    useParams.mockReturnValue({})
    const props = getProps(false, jest.fn())
    const component = shallow(<ConfigureRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(component.isEmptyRender()).toBe(true)
  })
})
