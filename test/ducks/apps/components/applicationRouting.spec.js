'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { ApplicationRouting } from 'ducks/apps/components/ApplicationRouting'

import mockApps from '../_mockApps'

// const mockRegistyApps = mockApps.filter(app => app.isInRegistry).filter(app =>
// (Array.isArray(app.versions.stable) && !!app.versions.stable.length))
const mockInstalledApps = mockApps.filter(a => a.installed)

const getMockProps = (parent, installedApps = mockInstalledApps, apps = mockApps, isFetching = false) => ({
  apps,
  installedApps,
  isFetching,
  parent,
  history: { push: jest.fn() },
  uninstallApp: jest.fn(),
  installApp: jest.fn()
})

describe('ApplicationRouting component with ApplicationDetails', () => {
  it('should handle correctly if app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should correctly go to parent if app not found', () => {
    const parent = 'myapps'
    const mockProps = getMockProps(parent)
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'mock' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/${parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if apps list is empty', () => {
    const mockProps = getMockProps('myapps', [], [])
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if isFetching', () => {
    const mockProps = getMockProps('myapps', [], [], true)
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })
})

describe('ApplicationRouting component with Modal', () => {
  it('should handle correctly if installed app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should handle correctly if uninstalled app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[1]
    // photos in mockApps is not installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'photos' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should correctly go to parent if app not found', () => {
    const parent = 'myapps'
    const mockProps = getMockProps(parent)
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'mock' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/${parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if apps list is empty', () => {
    const mockProps = getMockProps('myapps', [], [])
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if isFetching', () => {
    const mockProps = getMockProps('myapps', [], [], true)
    const component = shallow(
      <ApplicationRouting {...mockProps} />
    )
    const routes = component.find(Route)
    expect(routes.length).toBe(2)
    const routeToDetails = routes.nodes[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToDetails.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })
})
