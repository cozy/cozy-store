'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../jestLib/I18n'
import { UninstallModal } from 'ducks/apps/components/UninstallModal'

import mockApps from '../_mockApps'

/* SinonJS is used here to stub Promise in order to be synchronous.
In this way, (p)React will call setState synchronously. It will allow
to assert the component state juste after */
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
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
  beforeAll(() => {
    // define global mock url
    global.cozy = {
      client: {
        _url: '//cozytest.mock.cc'
      }
    }
  })

  it('should be rendered correctly (app uninstallable)', () => {
    const component = shallow(
      <UninstallModal t={tMock} {...getMockProps('photos')} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('calls onNotInstalled', () => {
    const props = getMockProps('photos')
    props.installed = false
    shallow(<UninstallModal t={tMock} {...props} />)
    expect(props.onNotInstalled.mock.calls.length).toBe(1)
  })

  it('should handle correctly error from props', () => {
    const mockProps = getMockProps('photos', mockError)
    const component = shallow(<UninstallModal t={tMock} {...mockProps} />)
    expect(component.getElement()).toMatchSnapshot()
  })
})
