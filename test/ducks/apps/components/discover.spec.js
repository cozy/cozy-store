'use strict'

import mockApps from 'ducks/apps/_mockApps'
import { Discover } from 'ducks/apps/components/Discover'
import { shallow } from 'enzyme'
import { tMock } from 'jestLib/I18n'
import React from 'react'

import { BarCenter } from 'cozy-bar'

const mockError = new Error('This is a test error')

const mockRegistyApps = mockApps
  .filter(app => app.isInRegistry)
  .filter(
    app => Array.isArray(app.versions.stable) && !!app.versions.stable.length
  )

const getMockProps = (
  apps = mockRegistyApps,
  isFetching = false,
  fetchError = null
) => ({
  fetchApps: jest.fn(),
  apps,
  isFetching,
  fetchError,
  actionError: null,
  navigate: jest.fn(),
  searchParams: new URLSearchParams()
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
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith(`/discover/collect`)
  })

  it('should transfer search params when navigating to app page', () => {
    const mockProps = getMockProps()
    mockProps.searchParams.set('type', 'konnector')
    mockProps.searchParams.set('category', 'isp')
    mockProps.searchParams.size = 2 // Bug: URLSearchParams have undefined size when run in tests so we have to enforce it
    const component = shallow(<Discover t={tMock} {...mockProps} />)
    const instance = component.instance()
    instance.onAppClick(mockRegistyApps[0].slug)
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith(
      `/discover/collect?type=konnector&category=isp`
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
