'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { InstallRoute } from 'ducks/apps/components/ApplicationRouting/InstallRoute'

import mockApps from '../../_mockApps'

const getAppMock = ({ params }) => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn(() => null)
})

describe('InstallRoute component', () => {
  it('should display install modal if app found in the registry but not installed', () => {
    const props = getProps()
    const component = shallow(<InstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // photos in mockApps is isInRegistry
    const routeProps = { match: { params: { appSlug: 'photos' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toMatchSnapshot()
  })

  it('should display install modal if app found in the registry installed but with available version', () => {
    const props = getProps()
    const component = shallow(<InstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // tasky in mockApps is isInRegistry, installed and availableVersion
    const routeProps = { match: { params: { appSlug: 'tasky' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    const props = getProps(true)
    const component = shallow(<InstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // photos in mockApps is isInRegistry
    const routeProps = { match: { params: { appSlug: 'photos' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toBe(null)
  })

  it('should redirectTo parent if no app found', () => {
    const props = getProps(false, jest.fn())
    const component = shallow(<InstallRoute {...props} />)
    const route = component.find(Route).getElement()
    const routeProps = { match: { params: {} } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBe(null)
  })

  it('should redirectTo parent if app found but installed without available version', () => {
    const props = getProps(false, jest.fn())
    const component = shallow(<InstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBe(null)
  })
})
