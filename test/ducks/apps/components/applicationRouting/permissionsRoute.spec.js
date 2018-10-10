'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { PermissionsRoute } from 'ducks/apps/components/ApplicationRouting/PermissionsRoute'

import mockApps from '../../_mockApps'

const getAppMock = ({ params }) => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn(() => null)
})

describe('PermissionsRoute component', () => {
  it('should display permissions modal if app found', () => {
    const props = getProps()
    const component = shallow(<PermissionsRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    const props = getProps(true)
    const component = shallow(<PermissionsRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toBe(null)
  })

  it('should redirectTo parent if no app found', () => {
    const props = getProps(false, jest.fn())
    const component = shallow(<PermissionsRoute {...props} />)
    const route = component.find(Route).getElement()
    const routeProps = { match: { params: {} } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBe(null)
  })
})
