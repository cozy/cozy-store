'use strict'

/* eslint-env jest */

import { AppVote } from 'ducks/components/AppVote'
import { shallow } from 'enzyme'
import React from 'react'

import { tMock } from '../jestLib/I18n'

describe('AppVote component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(<AppVote t={tMock} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
