'use strict'

/* eslint-env jest */

import { ApplicationRouting } from 'ducks/apps/components/ApplicationRouting'
import { shallow } from 'enzyme'
import React from 'react'
import { Route } from 'react-router-dom'

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
  location: { search: '' },
  navigate: jest.fn(),
  uninstallApp: jest.fn().mockName('mockUninstallApp'),
  installApp: jest.fn().mockName('mockInstallApp')
})

const TOTAL_ROUTES = 6

describe('ApplicationRouting main component', () => {
  it('should render routes components correctly if app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    expect(component.find(Route).length).toBe(TOTAL_ROUTES)
  })

  it('should call navigate from props with redirectTo', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    component.instance().redirectTo('/myapps')
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith('/myapps', {
      replace: true
    })
  })
})
