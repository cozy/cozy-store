'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { tMock } from '../../jestLib/I18n'
import SmallAppItem from '../../../src/ducks/components/SmallAppItem'
import { MyApplications } from '../../../src/ducks/apps/components/MyApplications'

import mockApps from './_mockApps'

const mockMyApplicationsError = new Error('This is a test error')

const getMockProps = (myApps = mockApps, isFetching = false, error = null) => ({
  fetchMyApps: jest.fn(),
  myApps,
  isFetching,
  error,
  history: { push: jest.fn() }
})

describe('MyApplications component', () => {
  it('should be rendered correctly if apps uninstalled', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a spinner if apps is fetching', () => {
    const mockProps = getMockProps([], true, null)
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should display error from props correctly', () => {
    const mockProps = getMockProps([], false, mockMyApplicationsError)
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should handle correctly items onClick', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    )
    expect(component.find(SmallAppItem).length).toBe(mockApps.length)
    const appItem = component.find(SmallAppItem).at(0).dive() // shallow on more level on first app item
    appItem.simulate('click')
    // history push to app modal URL
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/myapps/${mockApps[0].slug}/manage`)
  })

  it('should handle correctly application modal with Route', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    expect(route.props().render({ match: {params: 'photos'} })).toBeDefined()
  })

  it('should not return application modal using Route if apps is fetching', () => {
    const mockProps = getMockProps([], true)
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    expect(route.props().render({ match: {params: 'photos'} })).toBeUndefined()
  })

  it('should not return application modal using Route if apps list is empty', () => {
    const mockProps = getMockProps([])
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    )
    const route = component.find(Route)
    expect(route.length).toBe(1)
    expect(route.props().render({ match: {params: 'photos'} })).toBeUndefined()
  })
})
