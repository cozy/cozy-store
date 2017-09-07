'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import SmallAppItem from '../../src/ducks/components/SmallAppItem'

const appMock = {
  slug: 'test',
  editor: 'cozy',
  developer: {
    name: 'Cozy'
  },
  icon: '<svg></svg>',
  name: 'Test',
  version: '3.0.3',
  onClick: jest.fn()
}

const appMock2 = {
  slug: 'test2',
  editor: '',
  developer: {
    name: 'Naming me'
  },
  icon: '<svg></svg>',
  name: 'Test2',
  version: '3.0.3-beta7483',
  onClick: jest.fn()
}

describe('SmallAppItem component', () => {
  it('should be rendered correctly using a format', () => {
    const component = shallow(
      <SmallAppItem {...appMock} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly using another format', () => {
    const component = shallow(
      <SmallAppItem {...appMock2} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
