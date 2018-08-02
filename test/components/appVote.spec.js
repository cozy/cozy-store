'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../jestLib/I18n'
import { AppVote } from 'ducks/components/AppVote'

Enzyme.configure({ adapter: new Adapter() })

describe('AppVote component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(<AppVote t={tMock} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
