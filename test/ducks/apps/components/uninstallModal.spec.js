'use strict'

/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'

import { tMock } from '../../../jestLib/I18n'
import mockApps from '../_mockApps'

import { UninstallModal } from '@/ducks/apps/components/UninstallModal'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
sinonStubPromise(sinon)

const mockError = new Error('This is a test error')

const getMockProps = (slug, uninstallError = null) => ({
  app: mockApps.find(a => a.slug === slug),
  parent: '/myapps',
  uninstallApp: jest.fn(appSlug => {
    if (['drive', 'collect'].includes(appSlug)) {
      return sinon
        .stub()
        .returnsPromise()
        .rejects(mockError)()
    }
    return sinon
      .stub()
      .returnsPromise()
      .resolves({})()
  }),
  history: {
    push: jest.fn()
  },
  onNotInstalled: jest.fn(),
  uninstallError
})

describe('UninstallModal component', () => {
  let mockClient
  beforeAll(() => {
    // define global mock url
    mockClient = {
      stackClient: {
        uri: '//cozytest.mock.cc'
      }
    }
  })

  const setup = ({ props }) => {
    const component = shallow(
      <UninstallModal
        client={mockClient}
        t={tMock}
        onSuccess={jest.fn()}
        dismissAction={jest.fn()}
        {...props}
      />
    )
    return { component }
  }

  it('should be rendered correctly (app uninstallable)', () => {
    const props = getMockProps('photos')
    const { component } = setup({ props })
    expect(component.getElement()).toMatchSnapshot()
  })

  it('calls onNotInstalled', () => {
    const props = { ...getMockProps('photos'), installed: false }
    setup({ props })
    expect(props.onNotInstalled.mock.calls.length).toBe(1)
  })

  it('should handle correctly error from props', () => {
    const props = getMockProps('photos', mockError)
    const { component } = setup({ props })
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should handle correctly linked app error', () => {
    const props = getMockProps(
      'photos',
      new Error('A linked OAuth client exists for this app')
    )
    const { component } = setup({ props })
    expect(component.getElement()).toMatchSnapshot()
  })
})
