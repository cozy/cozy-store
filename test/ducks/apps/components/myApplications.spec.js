'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import { MyApplications } from 'ducks/apps/components/MyApplications'

import mockApps from '../_mockApps'

Enzyme.configure({ adapter: new Adapter() })

const mockMyApplicationsError = new Error('This is a test error')

const mockInstalledApps = mockApps.filter(a => a.installed)

const getMockProps = (
  installedApps = mockInstalledApps,
  isFetching = false,
  fetchError = null,
  match = { isExact: true }
) => ({
  fetchInstalledApps: jest.fn(),
  uninstallApp: jest.fn(),
  installedApps,
  isFetching,
  fetchError,
  actionError: null,
  history: { push: jest.fn() },
  match
})

describe('MyApplications component', () => {
  it('should be rendered correctly if apps uninstalled', () => {
    const mockProps = getMockProps()
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

  it('should render only routing if path not exactly match /myapps', () => {
    const mockProps = getMockProps(mockInstalledApps, false, null, {
      isExact: false
    })
    const component = shallow(
      <MyApplications t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
