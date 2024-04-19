'use strict'

import { MyApplications } from 'ducks/apps/components/MyApplications'
import { shallow } from 'enzyme'
import React from 'react'

import { BarCenter } from 'cozy-bar'

import { tMock } from '../../../jestLib/I18n'
import mockApps from '../_mockApps'

const mockMyApplicationsError = new Error('This is a test error')

const mockInstalledApps = mockApps.filter(a => a.installed)

const getMockProps = (
  installedApps = mockInstalledApps,
  isFetching = false,
  fetchError = null
) => ({
  fetchApps: jest.fn(),
  uninstallApp: jest.fn(),
  installedApps,
  isFetching,
  fetchError,
  actionError: null,
  navigate: jest.fn(),
  searchParams: new URLSearchParams()
})

describe('MyApplications component', () => {
  it('should be rendered correctly if apps uninstalled', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with apps and URL search params', () => {
    // default values so use null
    const mockProps = getMockProps(
      mockInstalledApps,
      false,
      null,
      { isExact: true },
      { search: '?category=cozy' }
    )
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a spinner if apps is fetching', () => {
    const mockProps = getMockProps([], true, null)
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should display error from props correctly', () => {
    const mockProps = getMockProps([], false, mockMyApplicationsError)
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should define the correct onAppClick function to pass to sections', () => {
    const mockProps = getMockProps()
    const component = shallow(<MyApplications t={tMock} {...mockProps} />)
    const instance = component.instance()
    instance.onAppClick(mockInstalledApps[0].slug)
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith(
      `/myapps/${mockInstalledApps[0].slug}`
    )
  })

  it('should use BarCenter from cozy-bar in mobile view only', () => {
    const mockProps = getMockProps()
    const component = shallow(<MyApplications t={tMock} {...mockProps} />)
    expect(component.find(BarCenter).length).toBe(0)
    const componentMobile = shallow(
      <MyApplications
        t={tMock}
        breakpoints={{ isMobile: true }}
        {...mockProps}
      />
    )
    expect(componentMobile.find(BarCenter).length).toBe(1)
    expect(componentMobile.getElement()).toMatchSnapshot()
  })

  it('should transfer search params when navigating to app page', () => {
    const mockProps = getMockProps()
    mockProps.searchParams.set('type', 'konnector')
    mockProps.searchParams.set('category', 'isp')
    mockProps.searchParams.size = 2 // Bug: URLSearchParams have undefined size when run in tests so we have to enforce it
    const component = shallow(<MyApplications t={tMock} {...mockProps} />)
    const instance = component.instance()
    instance.onAppClick(mockInstalledApps[0].slug)
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith(
      `/myapps/collect?type=konnector&category=isp`
    )
  })
})
