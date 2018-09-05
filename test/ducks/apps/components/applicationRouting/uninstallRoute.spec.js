'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { UninstallRoute } from 'ducks/apps/components/ApplicationRouting/UninstallRoute'

import mockApps from '../../_mockApps'

const getAppMock = ({ params }) => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn()
})

describe('UninstallRoute component', () => {
  it('should display uninstall modal if installed app found', () => {
    const props = getProps()
    const component = shallow(<UninstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // tasky in mockApps is installed and uninstallable
    const routeProps = { match: { params: { appSlug: 'tasky' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    const props = getProps(true)
    const component = shallow(<UninstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // photos in mockApps is isInRegistry
    const routeProps = { match: { params: { appSlug: 'photos' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should redirectTo parent if no app found', () => {
    const props = getProps(false, jest.fn())
    const component = shallow(<UninstallRoute {...props} />)
    const route = component.find(Route).getElement()
    const routeProps = { match: { params: {} } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should redirectTo parent if app found but not uninstallable', () => {
    const props = getProps(false, jest.fn())
    const component = shallow(<UninstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // drive in mockApps is installed and not uninstallable
    const routeProps = { match: { params: { appSlug: 'drive' } } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should redirectTo parent if app found but not installed', () => {
    const props = getProps()
    const component = shallow(<UninstallRoute {...props} />)
    const route = component.find(Route).getElement()
    // drive in mockApps is not installed
    const routeProps = { match: { params: { appSlug: 'drive' } } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBeUndefined()
  })
})
