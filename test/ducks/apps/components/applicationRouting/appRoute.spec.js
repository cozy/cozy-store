'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { AppRoute } from 'ducks/apps/components/ApplicationRouting/AppRoute'

import mockApps from '../../_mockApps'

const getAppMock = ({ params }) => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn()
})

describe('AppRoute component', () => {
  it('should display app page if app found', () => {
    const props = getProps()
    const component = shallow(<AppRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = route.props.render(routeProps)
    expect(
      shallow(resultComponent)
        .dive()
        .getElement()
    ).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    const props = getProps(true)
    const component = shallow(<AppRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should redirectTo parent if no app found', () => {
    const props = getProps(false, jest.fn())
    const component = shallow(<AppRoute {...props} />)
    const route = component.find(Route).getElement()
    const routeProps = { match: { params: {} } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBeUndefined()
  })
})
