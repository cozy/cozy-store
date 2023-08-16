'use strict'

/* eslint-env jest */

import { Partnership } from 'ducks/apps/components/Partnership'
import { shallow } from 'enzyme'
import React from 'react'

import { tMock } from '../../../jestLib/I18n'
import mockAppVersion from '../_mockPhotosRegistryVersion'

const appWithPartnership = Object.assign({}, mockAppVersion, {
  partnership: {
    icon: '/registry/mockapp/1.0.0/partnership_icon',
    description: 'A legal for this mock partnership'
  }
})

describe('Partnership component', () => {
  it('should be rendered correctly the parternship informations', () => {
    const component = shallow(
      <Partnership t={tMock} app={appWithPartnership} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
