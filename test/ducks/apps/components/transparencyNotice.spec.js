'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import {
  TransparencyModal,
  LabelItem,
  mdParseParagraphs
} from 'ducks/apps/components/TransparencyModal'

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

describe('TransparencyModal component', () => {
  it('should be rendered correctly', () => {
    const props = getProps()
    const component = shallow(
      <TransparencyModal t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle click on label for notice', () => {
    const props = getProps()
    const component = shallow(<TransparencyModal t={tMock} {...props} />)
    const backButton = component.find('button')
    backButton.simulate('click')
    expect(props.history.replace.mock.calls.length).toBe(1)
    expect(props.history.replace.mock.calls[0][0]).toBe(props.match.url)
  })
})

describe('LabelItem component', () => {
  ;['A', 'B', 'C', 'D', 'E', 'F'].map(label => {
    it(`should label item ${label} correctly`, () => {
      const component = shallow(
        <LabelItem t={tMock} label={label} />
      ).getElement()
      expect(component).toMatchSnapshot()
    })
  })
})

describe('mdParseParagraphs function', () => {
  it('wrap paragraphs correctly', () => {
    const result = shallow(
      mdParseParagraphs({
        children: 'A text wrapped in a p element'
      })
    ).getElement()
    expect(result).toMatchSnapshot()
  })
})
