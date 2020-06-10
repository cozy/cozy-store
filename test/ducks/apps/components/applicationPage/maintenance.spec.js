'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../../jestLib/I18n'
import { extend as extendI18n } from 'cozy-ui/transpiled/react/I18n'
import { Maintenance } from 'ducks/apps/components/ApplicationPage/Maintenance'

import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'
const konnectorManifest = mockKonnector.manifest

konnectorManifest.locales.en.maintenance = {
  short_message: 'Test mock maintenance',
  long_message: 'long message to test mock maintenance'
}

extendI18n({ apps: { [konnectorManifest.slug]: konnectorManifest.locales.en } })

describe('Maintenance component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <Maintenance t={tMock} slug={konnectorManifest.slug} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
