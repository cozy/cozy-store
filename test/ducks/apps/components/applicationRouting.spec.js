'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Route } from 'react-router-dom'

import { ApplicationRouting } from 'ducks/apps/components/ApplicationRouting'

import mockApps from '../_mockApps'

Enzyme.configure({ adapter: new Adapter() })

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
  history: { push: jest.fn() },
  uninstallApp: jest.fn().mockName('mockUninstallApp'),
  installApp: jest.fn().mockName('mockInstallApp'),
  updateApp: jest.fn().mockName('mockUpdateApp')
})

const TOTAL_ROUTES = 5

describe('ApplicationRouting component with ApplicationPage', () => {
  it('should handle correctly if app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToAppPage = routes.getElements()[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToAppPage.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should render correctly if apps list is null but not installedApps', () => {
    const mockProps = getMockProps('myapps', mockInstalledApps, null)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToAppPage = routes.getElements()[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToAppPage.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should correctly go to parent if app not found', () => {
    const parent = 'myapps'
    const mockProps = getMockProps(parent)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToAppPage = routes.getElements()[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'mock' } } }
    const resultComponent = routeToAppPage.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/${parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if apps list is empty', () => {
    const mockProps = getMockProps('myapps', [], [])
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToAppPage = routes.getElements()[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToAppPage.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if neither apps and installedApps are provided', () => {
    const mockProps = getMockProps('myapps', null, null)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToAppPage = routes.getElements()[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToAppPage.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if isFetching', () => {
    const mockProps = getMockProps('myapps', [], [], true)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToAppPage = routes.getElements()[0]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToAppPage.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })
})

describe('ApplicationRouting component with Modal', () => {
  it('should handle correctly if installed app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[2]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should render correctly if uninstalled app found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[2]
    // photos in mockApps is not installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'photos' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should correctly go to parent if app not found', () => {
    const parent = 'myapps'
    const mockProps = getMockProps(parent)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[2]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'mock' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/${parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should render correctly if apps list is null but not installedApps', () => {
    const mockProps = getMockProps('myapps', mockInstalledApps, null)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[2]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should not return anything if apps lists is empty', () => {
    const mockProps = getMockProps('myapps', [], [])
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[2]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if isFetching', () => {
    const mockProps = getMockProps('myapps', [], [], true)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[2]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })
})

describe('ApplicationRouting component with Channel install', () => {
  it('should handle correctly if installed app found', () => {
    const mockProps = getMockProps('discover')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'collect', channel: 'beta' } }
    }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should render correctly if uninstalled app found', () => {
    const mockProps = getMockProps('discover')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[1]
    // photos in mockApps is not installed and isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'photos', channel: 'beta' } }
    }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should correctly go to parent if app not found', () => {
    const parent = 'discover'
    const mockProps = getMockProps(parent)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[1]
    const routeProps = {
      match: { params: { appSlug: 'mock', channel: 'beta' } }
    }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/${parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should correctly go to parent if app not in registry', () => {
    const parent = 'discover'
    const mockProps = getMockProps(parent)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[1]
    // drive in mockApps is installed and but not isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'drive', channel: 'beta' } }
    }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/${parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should correctly redirect to manage app modal if channel not recognized', () => {
    const parent = 'discover'
    const mockProps = getMockProps(parent)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'collect', channel: 'mock' } }
    }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(
      `/${parent}/collect/manage`
    )
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if apps lists is empty', () => {
    const mockProps = getMockProps('discover', [], [])
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'collect', channel: 'beta' } }
    }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if isFetching', () => {
    const mockProps = getMockProps('discover', [], [], true)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[1]
    // collect in mockApps is installed and isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'collect', channel: 'beta' } }
    }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })
})

describe('ApplicationRouting component with IntentModal', () => {
  it('should handle correctly if installed konnector found', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[4]
    // konnector-trinlane in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'konnector-trinlane' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeDefined()
    expect(resultComponent).toMatchSnapshot()
  })

  it('should not return anything if app type is webapp', () => {
    const mockProps = getMockProps('myapps')
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[4]
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should correctly go to parent if app not found', () => {
    const parent = 'myapps'
    const mockProps = getMockProps(parent)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[4]
    // konnector-trinlane in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'mock' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(`/${parent}`)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if isFetching', () => {
    const mockProps = getMockProps('myapps', [], [], true)
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[4]
    // konnector-trinlane in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'konnector-trinlane' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })

  it('should not return anything if apps lists is empty', () => {
    const mockProps = getMockProps('myapps', [], [])
    const component = shallow(<ApplicationRouting {...mockProps} />)
    const routes = component.find(Route)
    expect(routes.length).toBe(TOTAL_ROUTES)
    const routeToModal = routes.getElements()[4]
    // konnector-trinlane in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'konnector-trinlane' } } }
    const resultComponent = routeToModal.props.render(routeProps)
    expect(resultComponent).toBeUndefined()
  })
})
