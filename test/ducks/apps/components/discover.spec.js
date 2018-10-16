'use strict'

/* eslint-env jest */
/* global cozy */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../jestLib/I18n'
import { Discover } from 'ducks/apps/components/Discover'

import mockApps from '../_mockApps'

const { BarCenter } = cozy.bar

const mockError = new Error('This is a test error')

const mockRegistyApps = mockApps
  .filter(app => app.isInRegistry)
  .filter(
    app => Array.isArray(app.versions.stable) && !!app.versions.stable.length
  )

const getMockProps = (
  apps = mockRegistyApps,
  isFetching = false,
  fetchError = null,
  match = { isExact: true },
  location = null
) => ({
  fetchApps: jest.fn(),
  apps,
  isFetching,
  fetchError,
  actionError: null,
  history: { push: jest.fn() },
  match,
  location
})

describe('Discover component', () => {
  it('should be rendered correctly with apps', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with apps and URL search params', () => {
    const mockProps = getMockProps(
      mockRegistyApps,
      false,
      null,
      { isExact: true },
      { search: '?category=cozy' }
    )
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a spinner if apps is fetching', () => {
    const mockProps = getMockProps([], true, null)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should display error from props correctly', () => {
    const mockProps = getMockProps([], false, mockError)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should define the correct onAppClick function to pass to sections', () => {
    const mockProps = getMockProps()
    const component = shallow(<Discover t={tMock} {...mockProps} />)
    const instance = component.instance()
    instance.onAppClick(mockRegistyApps[0].slug)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(
      `/discover/${mockRegistyApps[0].slug}`
    )
  })

  it('should use BarCenter from cozy-bar in mobile view only', () => {
    const mockProps = getMockProps()
    const component = shallow(<Discover t={tMock} {...mockProps} />)
    expect(component.find(BarCenter).length).toBe(0)
    const componentMobile = shallow(
      <Discover t={tMock} breakpoints={{ isMobile: true }} {...mockProps} />
    )
    expect(componentMobile.find(BarCenter).length).toBe(1)
    expect(componentMobile.getElement()).toMatchSnapshot()
  })
})
