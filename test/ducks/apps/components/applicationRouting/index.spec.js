'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { ApplicationRouting } from 'ducks/apps/components/ApplicationRouting'

import mockApps from '../../_mockApps'

// const mockRegistyApps = mockApps.filter(app => app.isInRegistry).filter(app =>
// (Array.isArray(app.versions.stable) && !!app.versions.stable.length))
const mockInstalledApps = mockApps.filter(a => a.installed)

const getMockProps = (
  parent,
  installedApps = mockInstalledApps,
  apps = mockApps,
  isFetching = false
) => ({
  apps,
  installedApps,
  isFetching,
  parent,
  history: { push: jest.fn(), replace: jest.fn() },
  uninstallApp: jest.fn().mockName('mockUninstallApp'),
  installApp: jest.fn().mockName('mockInstallApp'),
  updateApp: jest.fn().mockName('mockUpdateApp')
})

const TOTAL_ROUTES = 6

describe('ApplicationRouting main component', () => {
  it('should render routes components correctly if app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    expect(component.children().length).toBe(TOTAL_ROUTES)
    expect(component).toMatchSnapshot()
  })

  it('should call history from props with redirectTo', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    component.instance().redirectTo('/myapps')
    expect(mockProps.history.replace.mock.calls.length).toBe(1)
    expect(mockProps.history.replace.mock.calls[0][0]).toBe('/myapps')
  })

  it('should call history from props with redirectTo', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    component.instance().redirectTo('/myapps')
    expect(mockProps.history.replace.mock.calls.length).toBe(1)
    expect(mockProps.history.replace.mock.calls[0][0]).toBe('/myapps')
  })
})
