'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import { PermissionsList } from 'ducks/apps/components/PermissionsList'

import mockAppVersion from '../_mockPhotosRegistryVersion'
import mockKonnectorVersion from '../_mockPKonnectorTrinlaneRegistryVersion'

Enzyme.configure({ adapter: new Adapter() })

describe('PermissionsList component', () => {
  beforeAll(() => {
    // define global mock url
    global.cozy = {
      client: {
        _url: '//cozytest.mock.cc'
      }
    }
  })

  it('should be rendered correctly with permissions', () => {
    const component = shallow(
      <PermissionsList t={tMock} app={mockAppVersion.manifest} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with konnector permissions', () => {
    const component = shallow(
      <PermissionsList t={tMock} app={mockKonnectorVersion.manifest} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly without permissions', () => {
    const component = shallow(
      <PermissionsList t={tMock} app={{ name: 'Mock' }} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
