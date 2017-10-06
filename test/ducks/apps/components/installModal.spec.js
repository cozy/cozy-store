'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../jestLib/I18n'
import { InstallModal } from '../../../../src/ducks/apps/components/InstallModal'

import mockApps from '../_mockApps'
import mockAppVersion from '../_mockAppRegistryVersion'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
sinonStubPromise(sinon)

const mockError = new Error('This is a test error')

const getMockProps = (slug, error = null, versionError = null, currentAppVersion = null) => ({
  app: mockApps.find(a => a.slug === slug),
  parent: '/discover',
  installApp: jest.fn((appSlug) => {
    if (appSlug === 'photos') return sinon.stub().returnsPromise().resolves(mockApps.find(a => a.slug === 'photos'))()
    return sinon.stub().returnsPromise().rejects(mockError)()
  }),
  fetchLastAppVersion: jest.fn((appSlug) => {
    // only photos has mock version here
    if (appSlug === 'photos') return sinon.stub().returnsPromise().resolves(mockAppVersion)()
    return sinon.stub().returnsPromise().rejects(mockError)()
  }),
  history: {
    push: jest.fn()
  },
  currentAppVersion,
  error,
  versionError
})

describe('InstallModal component', () => {
  beforeAll(() => {
    // define global mock url
    global.cozy = {
      client: {
        _url: '//cozytest.mock.cc'
      }
    }
  })

  it('should be rendered correctly if app found', () => {
    const component = shallow(
      <InstallModal t={tMock} {...getMockProps('photos')} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with currentAppVersion fetched', () => {
    const mockProps = getMockProps('photos', null, null, mockAppVersion)
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should not break the permissions part if no permissions property found in manifest', () => {
    const mockProps = getMockProps('photos', null, null, { manifest: {} })
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should go to parent if app not found', () => {
    const mockProps = getMockProps('unknown')
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    )
    expect(component.type()).toBe(null)
    // goToParent should be called once
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(mockProps.parent)
  })

  it('should hanlde correctly error from props', () => {
    const mockProps = getMockProps('photos', mockError)
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    )
    expect(component.node).toMatchSnapshot()
  })

  it('should hanlde correctly versionError from props', () => {
    const mockProps = getMockProps('photos', null, mockError)
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    )
    expect(component.node).toMatchSnapshot()
  })

  it('should call the correct props function on install', async () => {
    const mockProps = getMockProps('photos')
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    )
    await component.instance().installApp()
    // uninstallApp from props should be called once
    expect(mockProps.installApp.mock.calls.length).toBe(1)
    expect(mockProps.installApp.mock.calls[0][0]).toBe('photos')
    // goToParent should be called
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(mockProps.parent)
  })

  it('should handle error from uninstall', async () => {
    const mockProps = getMockProps('drive')
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    )
    await component.instance().installApp()
    // uninstallApp from props should be called once
    expect(mockProps.installApp.mock.calls.length).toBe(1)
    expect(mockProps.installApp.mock.calls[0][0]).toBe('drive')
    // goToParent shouldn't be called
    expect(mockProps.history.push.mock.calls.length).toBe(0)
  })
})
