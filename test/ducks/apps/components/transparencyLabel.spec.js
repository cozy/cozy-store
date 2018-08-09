'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import { TransparencyLabel } from 'ducks/apps/components/TransparencyLabel'

import mockAppVersion from '../_mockPhotosRegistryVersion'

Enzyme.configure({ adapter: new Adapter() })

const getProps = () => ({
  t: tMock,
  app: mockAppVersion,
  history: {
    replace: jest.fn()
  },
  match: {
    url: '/myapps/photos/manage'
  }
})

describe('TransparencyLabel component', () => {
  it('should be rendered correctly', () => {
    const props = getProps()
    const component = shallow(
      <TransparencyLabel t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle click on label for notice', () => {
    const props = getProps()
    const component = shallow(<TransparencyLabel t={tMock} {...props} />)
    const labelButton = component.find('button')
    labelButton.simulate('click')
    expect(props.history.replace.mock.calls.length).toBe(1)
    expect(props.history.replace.mock.calls[0][0]).toBe(
      `${props.match.url}/transparency`
    )
  })
})
