'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../jestLib/I18n'
import { ApplicationModal } from '../../../src/ducks/myApps/components/ApplicationModal'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
sinonStubPromise(sinon)

const mockError = new Error('This is a test error')

const getMockProps = (slug) => ({
  match: {
    params: {
      appSlug: slug || 'collect'
    }
  },
  myApps: [{
    slug: 'drive',
    uninstallable: false
  },
  {
    slug: 'photos',
    uninstallable: true
  },
  {
    slug: 'collect',
    uninstallable: false
  }],
  uninstallApp: jest.fn((appSlug) => {
    if (['drive', 'collect'].includes(appSlug)) return sinon.stub().returnsPromise().rejects(mockError)()
    return sinon.stub().returnsPromise().resolves({})()
  }),
  history: {
    push: jest.fn()
  }
})

describe('ApplicationModal component', () => {
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
      <ApplicationModal t={tMock} {...getMockProps('collect')} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly if app uninstallable', () => {
    const component = shallow(
      <ApplicationModal t={tMock} {...getMockProps('photos')} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should go to parent if app not found', () => {
    const mockProps = getMockProps('unknown')
    const component = shallow(
      <ApplicationModal t={tMock} {...mockProps} />
    )
    expect(component.type()).toBe(null)
    // goToParent should be called once
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe('/myapps')
  })

  it('should hanlde correctly error in state', () => {
    const mockProps = getMockProps('photos')
    const component = shallow(
      <ApplicationModal t={tMock} {...mockProps} />
    )
    component.setState({ error: {message: 'This is a test error'} })
    expect(component.node).toMatchSnapshot()
  })

  it('should call the correct props function on uninstall', async () => {
    const mockProps = getMockProps('photos')
    const component = shallow(
      <ApplicationModal t={tMock} {...mockProps} />
    )
    await component.instance().uninstallApp()
    expect(component.state('error')).toBe(null)
    // uninstallApp from props should be called once
    expect(mockProps.uninstallApp.mock.calls.length).toBe(1)
    expect(mockProps.uninstallApp.mock.calls[0][0]).toBe('photos')
    // goToParent should be called once
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe('/myapps')
  })

  it('should handle error from uninstall', async () => {
    const mockProps = getMockProps('drive')
    const component = shallow(
      <ApplicationModal t={tMock} {...mockProps} />
    )
    await component.instance().uninstallApp()
    expect(component.state('error')).toBe(mockError)
    // uninstallApp from props should be called once
    expect(mockProps.uninstallApp.mock.calls.length).toBe(1)
    expect(mockProps.uninstallApp.mock.calls[0][0]).toBe('drive')
    // goToParent shouldn't be called
    expect(mockProps.history.push.mock.calls.length).toBe(0)
  })
})
