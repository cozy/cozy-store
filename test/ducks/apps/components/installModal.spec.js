'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { InstallModal } from 'ducks/apps/components/InstallModal'

import mockApps from '../_mockApps'
import mockAppVersion from '../_mockPhotosRegistryVersion'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
sinonStubPromise(sinon)

const mockError = new Error('This is a test error')

const getMockProps = (fromRegistry = false) => ({
  app: fromRegistry
    ? Object.assign(
        {},
        mockAppVersion.manifest,
        mockApps.find(a => a.slug === 'photos')
      )
    : mockApps.find(a => a.slug === 'photos'),
  dismissAction: jest.fn(),
  parent: '/discover',
  onAlreadyInstalled: jest.fn(),
  onSuccess: jest.fn(app => {
    if (app.slug === 'photos' || app.slug === 'konnector-bouilligue') {
      return sinon
        .stub()
        .returnsPromise()
        .resolves(mockApps.find(a => a.slug === app.slug))()
    }
    return sinon
      .stub()
      .returnsPromise()
      .rejects(mockError)()
  }),
  history: {
    push: jest.fn()
  }
})

describe('InstallModal component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  beforeAll(() => {
    // define global mock url
    global.cozy = {
      client: {
        _url: '//cozytest.mock.cc'
      }
    }
  })

  it('should be rendered correctly if app found', () => {
    const component = shallow(<InstallModal {...getMockProps()} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with also app in registry', () => {
    const mockProps = getMockProps(true)
    const component = shallow(<InstallModal {...mockProps} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly to update app with availableVersion', () => {
    const mockProps = getMockProps(true)
    mockProps.app.installed = true
    mockProps.app.availableVersion = '4.0.0'
    const component = shallow(<InstallModal {...mockProps} />).getElement()
    expect(component).toMatchSnapshot()
    expect(mockProps.onAlreadyInstalled.mock.calls.length).toBe(0)
  })

  it('should not break the permissions part if no permissions property found in manifest', () => {
    const mockProps = getMockProps(true)
    delete mockProps.app.permissions
    const component = shallow(<InstallModal {...mockProps} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle focus trop correctly', () => {
    const wrapper = shallow(<InstallModal {...getMockProps()} />)
    expect(wrapper.state().activeTrap).toBe(true)
    wrapper.instance().unmountTrap()
    expect(wrapper.state().activeTrap).toBe(false)
  })

  it('calls onAlreadyInstalled if app installed without update', () => {
    const mockProps = getMockProps(true)
    mockProps.app.installed = true
    shallow(<InstallModal {...mockProps} />)
    expect(mockProps.onAlreadyInstalled.mock.calls.length).toBe(1)
  })

  it('calls onAlreadyInstalled if app status updated to installed', () => {
    const mockProps = getMockProps(true)
    mockProps.app.installed = false
    const wrapper = shallow(<InstallModal {...mockProps} />)
    expect(mockProps.onAlreadyInstalled.mock.calls.length).toBe(0)
    mockProps.app.installed = true
    wrapper.setProps(mockProps)
    expect(mockProps.onAlreadyInstalled.mock.calls.length).toBe(1)
  })
})
