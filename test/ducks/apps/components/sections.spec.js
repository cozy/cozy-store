'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import { Sections } from 'ducks/apps/components/Sections'

import mockApps from '../_mockApps'

Enzyme.configure({ adapter: new Adapter() })

describe('AppsSection component', () => {
  it('should be rendered correctly with apps list, subtitle and onAppClick', () => {
    const mockOnAppClick = jest.fn()
    const component = shallow(
      <Sections
        t={tMock}
        lang="en"
        subtitle="Test Apps"
        apps={mockApps}
        onAppClick={mockOnAppClick}
        error={null}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly render message if error provided', () => {
    const mockOnAppClick = jest.fn()
    const component = shallow(
      <Sections
        t={tMock}
        lang="en"
        subtitle="Test Apps"
        apps={mockApps}
        onAppClick={mockOnAppClick}
        error={new Error('This is a test error')}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
