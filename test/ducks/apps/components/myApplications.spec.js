'use strict'

/* eslint-env jest */
/* global cozy */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../jestLib/I18n'
import { MyApplications } from 'ducks/apps/components/MyApplications'

import mockApps from '../_mockApps'

const { BarCenter } = cozy.bar

const mockMyApplicationsError = new Error('This is a test error')

const mockInstalledApps = mockApps.filter(a => a.installed)

const getMockProps = (
  installedApps = mockInstalledApps,
  isFetching = false,
  fetchError = null,
  match = { isExact: true },
  location = null
) => ({
  fetchApps: jest.fn(),
  uninstallApp: jest.fn(),
  installedApps,
  isFetching,
  fetchError,
  actionError: null,
  history: { push: jest.fn() },
  match,
  location
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
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(
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
})
