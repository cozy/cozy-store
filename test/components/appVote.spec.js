'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../jestLib/I18n'
import { AppVote } from 'ducks/components/AppVote'

describe('AppVote component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(<AppVote t={tMock} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
