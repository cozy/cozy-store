'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../jestLib/I18n'
import { UninstallModal } from '../../../src/ducks/apps/components/UninstallModal'

import mockApps from './_mockApps'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
sinonStubPromise(sinon)

const mockError = new Error('This is a test error')

const getMockProps = (slug, error = null) => ({
  app: mockApps.find(a => a.slug === slug),
  parent: '/myapps',
  uninstallApp: jest.fn((appSlug) => {
    if (['drive', 'collect'].includes(appSlug)) return sinon.stub().returnsPromise().rejects(mockError)()
    return sinon.stub().returnsPromise().resolves({})()
  }),
  history: {
    push: jest.fn()
  },
  error
})

describe('UninstallModal component', () => {
  beforeAll(() => {
    // define global mock url
    global.cozy = {
      client: {
        _url: '//cozytest.mock.cc'
      }
    }
  })

  it('should be rendered correctly if app not uninstallable', () => {
    const component = shallow(
      <UninstallModal t={tMock} {...getMockProps('collect')} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly if app uninstallable', () => {
    const component = shallow(
      <UninstallModal t={tMock} {...getMockProps('photos')} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should go to parent if app not found', () => {
    const mockProps = getMockProps('unknown')
    const component = shallow(
      <UninstallModal t={tMock} {...mockProps} />
    )
    expect(component.type()).toBe(null)
    // goToParent should be called once
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(mockProps.parent)
  })

  it('should hanlde correctly error from props', () => {
    const mockProps = getMockProps('photos', mockError)
    const component = shallow(
      <UninstallModal t={tMock} {...mockProps} />
    )
    expect(component.node).toMatchSnapshot()
  })

  it('should call the correct props function on uninstall', async () => {
    const mockProps = getMockProps('photos')
    const component = shallow(
      <UninstallModal t={tMock} {...mockProps} />
    )
    await component.instance().uninstallApp()
    // uninstallApp from props should be called once
    expect(mockProps.uninstallApp.mock.calls.length).toBe(1)
    expect(mockProps.uninstallApp.mock.calls[0][0]).toBe('photos')
    // goToParent should be called
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(mockProps.parent)
  })

  it('should handle error from uninstall', async () => {
    const mockProps = getMockProps('drive')
    const component = shallow(
      <UninstallModal t={tMock} {...mockProps} />
    )
    await component.instance().uninstallApp()
    // uninstallApp from props should be called once
    expect(mockProps.uninstallApp.mock.calls.length).toBe(1)
    expect(mockProps.uninstallApp.mock.calls[0][0]).toBe('drive')
    // goToParent shouldn't be called
    expect(mockProps.history.push.mock.calls.length).toBe(0)
  })
})
