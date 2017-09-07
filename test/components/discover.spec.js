'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../jestLib/I18n'
import { Discover } from '../../src/ducks/components/Discover'

describe('Discover component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <Discover t={tMock} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
