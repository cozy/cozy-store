'use strict'

/* eslint-env jest */

import { PermissionsList } from '@/ducks/apps/components/PermissionsList'
import { shallow } from 'enzyme'
import React from 'react'

import { tMock } from '../../../jestLib/I18n'
import mockBankKonnectorWithExternalDoctype from '../_mockBankKonnectorWithExternalDoctype'
import mockKonnectorVersion from '../_mockPKonnectorTrinlaneRegistryVersion'
import mockAppVersion from '../_mockPhotosRegistryVersion'
import { webapp } from '../_mockWebappRegistryVersion'

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

  it('should be rendered correctly with webapp permissions', () => {
    const component = shallow(
      <PermissionsList t={tMock} app={webapp} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly without permissions', () => {
    const component = shallow(
      <PermissionsList t={tMock} app={{ name: 'Mock' }} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly when is a bank with external doctypes permissions', () => {
    const component = shallow(
      <PermissionsList t={tMock} app={mockBankKonnectorWithExternalDoctype} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
