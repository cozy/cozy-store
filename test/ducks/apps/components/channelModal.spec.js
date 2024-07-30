'use strict'

/* eslint-env jest */

import AppInstallation from 'ducks/apps/components/AppInstallation'
import { ChannelModal } from 'ducks/apps/components/ChannelModal'
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

const getMockProps = () => ({
  channel: 'beta',
  app: Object.assign(
    {},
    mockAppVersion.manifest,
    mockApps.find(a => a.slug === 'photos'),
    { installed: true, source: 'registry://photos/stable' }
  ),
  dismissAction: jest.fn(),
  restoreAppIfSaved: jest.fn(),
  onCurrentChannel: jest.fn(),
  onNotHandled: jest.fn(),
  fetchLatestApp: jest.fn(),
  onSuccess: jest.fn(app => {
    if (app.slug === 'photos' || app.slug === 'konnector-bouilligue') {
      return sinon
        .stub()
        .returnsPromise()
        .resolves(mockApps.find(a => a.slug === app.slug))()
    }
    return sinon.stub().returnsPromise().rejects(mockError)()
  })
})

describe('ChannelModal component', () => {
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

  it('should be rendered correctly if app found and from registry', () => {
    const mockProps = getMockProps()
    const component = shallow(<ChannelModal {...mockProps} />).getElement()
    expect(component).toMatchSnapshot()
    expect(mockProps.fetchLatestApp.mock.calls.length).toBe(1)
    expect(mockProps.fetchLatestApp.mock.calls[0][0]).toBe(mockProps.app)
    expect(mockProps.fetchLatestApp.mock.calls[0][1]).toBe(mockProps.channel)
  })

  it('should call onNotHandled if app not installed', () => {
    const mockProps = getMockProps()
    mockProps.app.installed = false
    shallow(<ChannelModal {...mockProps} />).getElement()
    expect(mockProps.onNotHandled.mock.calls.length).toBe(1)
    expect(mockProps.fetchLatestApp.mock.calls.length).toBe(0)
  })

  it('should call onNotHandled if app not from registry', () => {
    const mockProps = getMockProps()
    mockProps.app.isInRegistry = false
    shallow(<ChannelModal {...mockProps} />).getElement()
    expect(mockProps.onNotHandled.mock.calls.length).toBe(1)
    expect(mockProps.fetchLatestApp.mock.calls.length).toBe(0)
  })

  it('should not break the permissions part if no permissions property found in manifest', () => {
    const mockProps = getMockProps()
    delete mockProps.app.permissions
    const component = shallow(<ChannelModal {...mockProps} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('calls onCurrentChannel if app already on asked channel', () => {
    const mockProps = getMockProps()
    mockProps.app.source = 'registry://photos/beta'
    shallow(<ChannelModal {...mockProps} />)
    expect(mockProps.onCurrentChannel.mock.calls.length).toBe(1)
    expect(mockProps.fetchLatestApp.mock.calls.length).toBe(0)
  })

  it('calls onCurrentChannel on update only if app changed to asked channel', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<ChannelModal {...mockProps} />)
    wrapper.setProps(mockProps) // update twice to test if not called twice
    mockProps.app.source = 'registry://photos/beta'
    wrapper.setProps(mockProps)
    expect(mockProps.onCurrentChannel.mock.calls.length).toBe(1)
  })

  it('call state restoring and dismiss on cancel', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<ChannelModal {...mockProps} />)
    const installationWrapper = wrapper.find(AppInstallation)
    installationWrapper.props().onCancel()
    expect(mockProps.restoreAppIfSaved.mock.calls.length).toBe(1)
    expect(mockProps.dismissAction.mock.calls.length).toBe(1)
  })
})
