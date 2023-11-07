'use strict'

/* eslint-env jest */

import { Maintenance } from 'ducks/apps/components/ApplicationPage/Maintenance'
import { shallow } from 'enzyme'
import React from 'react'

import { extend as extendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { tMock } from '../../../../jestLib/I18n'
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
