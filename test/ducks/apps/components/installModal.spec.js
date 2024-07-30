'use strict'

/* eslint-env jest */

import AppInstallation from 'ducks/apps/components/AppInstallation'
import { InstallModal } from 'ducks/apps/components/InstallModal'
import { shallow } from 'enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'

import mockApps from '../_mockApps'
import mockAppVersion from '../_mockPhotosRegistryVersion'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
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
  restoreAppIfSaved: jest.fn(),
  parent: '/discover',
  fetchLatestApp: jest.fn(),
  onInstalled: jest.fn(),
  onSuccess: jest.fn(app => {
    if (app.slug === 'photos' || app.slug === 'konnector-bouilligue') {
      return sinon
        .stub()
        .returnsPromise()
        .resolves(mockApps.find(a => a.slug === app.slug))()
    }
    return sinon.stub().returnsPromise().rejects(mockError)()
  }),
  history: {
    push: jest.fn()
  },
  redirectToConfigure: jest.fn(),
  redirectToApp: jest.fn()
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
    expect(mockProps.onInstalled.mock.calls.length).toBe(0)
  })

  it('should not break the permissions part if no permissions property found in manifest', () => {
    const mockProps = getMockProps(true)
    delete mockProps.app.permissions
    const component = shallow(<InstallModal {...mockProps} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('calls onInstalled if app installed without update', () => {
    const mockProps = getMockProps(true)
    mockProps.app.installed = true
    shallow(<InstallModal {...mockProps} />)
    expect(mockProps.onInstalled.mock.calls.length).toBe(1)
  })

  it('call state restoring and dismiss on cancel', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<InstallModal {...mockProps} />)
    const installationWrapper = wrapper.find(AppInstallation)
    installationWrapper.props().onCancel()
    expect(mockProps.restoreAppIfSaved.mock.calls.length).toBe(1)
    expect(mockProps.dismissAction.mock.calls.length).toBe(1)
  })
})
