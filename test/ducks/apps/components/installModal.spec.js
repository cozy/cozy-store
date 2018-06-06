'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import { InstallModal } from 'ducks/apps/components/InstallModal'

import mockApps from '../_mockApps'
import mockAppVersion from '../_mockPhotosRegistryVersion'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
sinonStubPromise(sinon)

Enzyme.configure({ adapter: new Adapter() })

const mockError = new Error('This is a test error')

const getMockProps = (slug, fromRegistry = null) => ({
  app: fromRegistry
    ? Object.assign(
        {},
        fromRegistry.manifest,
        mockApps.find(a => a.slug === slug)
      )
    : mockApps.find(a => a.slug === slug),
  parent: '/discover',
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
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with also app in registry', () => {
    const mockProps = getMockProps('photos', null, null, mockAppVersion)
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not break the permissions part if no permissions property found in manifest', () => {
    const mockProps = getMockProps('photos', null, null, mockAppVersion)
    delete mockProps.app.permissions
    const component = shallow(
      <InstallModal t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should go to parent if app not found', () => {
    const mockProps = getMockProps('unknown')
    const component = shallow(<InstallModal t={tMock} {...mockProps} />)
    component.setProps(mockProps)
    expect(component.type()).toBe(null)
    // goToParent should be called once to go to the parent view
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(mockProps.parent)
  })
})
