'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import SmallAppItem from 'ducks/components/SmallAppItem'
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

  it('should handle correctly items onClick', () => {
    const mockProps = getMockProps()
    const component = shallow(<MyApplications t={tMock} {...mockProps} />)
    expect(component.find(SmallAppItem).length).toBe(mockInstalledApps.length)
    const appItem = component
      .find(SmallAppItem)
      .at(0)
      .dive() // shallow on more level on first app item
    appItem.simulate('click')
    // history push to app modal URL
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
