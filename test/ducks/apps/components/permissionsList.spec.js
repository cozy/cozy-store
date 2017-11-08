'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../jestLib/I18n'
import { PermissionsList } from 'ducks/apps/components/PermissionsList'

import mockAppVersion from '../_mockPhotosRegistryVersion'

describe('MyApplications component', () => {
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
      <PermissionsList t={tMock} appName='Mock' permissions={mockAppVersion.manifest.permissions} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly without permissions', () => {
    const component = shallow(
      <PermissionsList t={tMock} appName='Mock' permissions={{}} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
