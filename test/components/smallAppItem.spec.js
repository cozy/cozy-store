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
  installed: true,
  onClick: jest.fn()
}

const appMockWithoutIcon = {
  slug: 'test2',
  editor: '',
  developer: {
    name: 'Naming me'
  },
  icon: '',
  name: 'Test2',
  version: '3.0.3-beta7483',
  installed: true,
  onClick: jest.fn()
}

describe('SmallAppItem component', () => {
  it('should be rendered correctly an app', () => {
    const component = shallow(
      <SmallAppItem {...appMock} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly an installed app', () => {
    const component = shallow(
      <SmallAppItem {...appMock2} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly an installed app', () => {
    const component = shallow(
      <SmallAppItem {...appMockWithoutIcon} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should not call onClick when Enter is not pressed', () => {
    const component = shallow(
      <SmallAppItem {...appMock} />
    )
    expect(component.find('div.sto-small-app-item').length).toBe(1)
    component.find('div.sto-small-app-item').simulate('keydown', {keyCode: 98})
    expect(appMock.onClick.mock.calls.length).toBe(0)
  })

  it('should call onClick when Enter is pressed', () => {
    const component = shallow(
      <SmallAppItem {...appMock} />
    )
    expect(component.find('div.sto-small-app-item').length).toBe(1)
    component.find('div.sto-small-app-item').simulate('keydown', {keyCode: 13})
    expect(appMock.onClick.mock.calls.length).toBe(1)
  })
})
