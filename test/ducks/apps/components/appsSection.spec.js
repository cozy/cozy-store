'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import { AppsSection } from 'ducks/apps/components/AppsSection'
import SmallAppItem from 'ducks/components/SmallAppItem'

import mockApps from '../_mockApps'

Enzyme.configure({ adapter: new Adapter() })

describe('AppsSection component', () => {
  it('should be rendered correctly with apps list, subtitle and onAppClick', () => {
    const mockOnAppClick = jest.fn()
    const component = shallow(
      <AppsSection
        t={tMock}
        lang='en'
        subtitle='Test Apps'
        appsList={mockApps}
        onAppClick={mockOnAppClick}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should run provided onAppClick on SmallAppItem click event', () => {
    const mockOnAppClick = jest.fn()
    const component = shallow(
      <AppsSection
        t={tMock}
        lang='en'
        subtitle='Test Apps'
        appsList={mockApps}
        onAppClick={mockOnAppClick}
      />
    )
    expect(component.find(SmallAppItem).length).toBe(mockApps.length)
    const appItem = component
      .find(SmallAppItem)
      .at(0)
      .dive() // shallow on more level on first app item
    appItem.simulate('click')
    expect(mockOnAppClick.mock.calls.length).toBe(1)
    expect(mockOnAppClick.mock.calls[0][0]).toBe(mockApps[0].slug)
  })
})
