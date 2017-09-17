'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { tMock } from '../../jestLib/I18n'
import SmallAppItem from '../../../src/ducks/components/SmallAppItem'
import { Discover } from '../../../src/ducks/apps/components/Discover'

import mockApps from './_mockApps'

const mockError = new Error('This is a test error')

const mockRegistyApps = mockApps.filter(app => app.isInRegistry).filter(app =>
(Array.isArray(app.versions.stable) && !!app.versions.stable.length))

const getMockProps = (apps = mockRegistyApps, isFetching = false, fetchError = null) => ({
  fetchApps: jest.fn(),
  apps,
  isFetching,
  fetchError,
  history: { push: jest.fn() }
})

describe('Discover component', () => {
  it('should be rendered correctly with apps', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a spinner if apps is fetching', () => {
    const mockProps = getMockProps([], true, null)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should display error from props correctly', () => {
    const mockProps = getMockProps([], false, mockError)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })
  it('should handle correctly items onClick', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    )
    expect(component.find(SmallAppItem).length).toBe(mockRegistyApps.length)
    const appItem = component.find(SmallAppItem).at(0).dive() // shallow on more level on first app item
    appItem.simulate('click')
    // history push to app modal URL
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/discover/${mockRegistyApps[0].slug}/manage`)
  })

  it('should handle correctly application modal with Route', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    // collect in mockApps is installed in isInRegistry
    expect(route.props().render({ match: { params: { appSlug: 'collect' } } })).toBeDefined()
  })

  it('should handle correctly application modal with Route if app not found', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    // collect in mockApps is installed in isInRegistry
    expect(route.props().render({ match: { params: { appSlug: 'mock' } } })).toBeDefined()
  })

  it('should not return application modal using Route if apps list is empty', () => {
    const mockProps = getMockProps([])
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    // collect in mockApps is installed in isInRegistry
    expect(route.props().render({ match: { params: { appSlug: 'collect' } } })).toBeUndefined()
  })

  it('should not return application modal using Route if fetchError', () => {
    const mockProps = getMockProps([], false, mockError)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    // collect in mockApps is installed in isInRegistry
    expect(route.props().render({ match: { params: { appSlug: 'collect' } } })).toBeUndefined()
  })

  it('should not return application modal using Route if isFetching', () => {
    const mockProps = getMockProps([], true)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    // collect in mockApps is installed in isInRegistry
    expect(route.props().render({ match: { params: { appSlug: 'collect' } } })).toBeUndefined()
  })
})
