'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../jestLib/I18n'
import { Sidebar } from 'ducks/components/Sidebar'

describe('Sidebar component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be rendered correctly', () => {
    const mockLocation = {
      search: ''
    }
    const component = shallow(
      <Sidebar t={tMock} location={mockLocation} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render if nav is disabled using search flag', () => {
    const mockLocation = {
      search: '?nav=false'
    }
    const component = shallow(
      <Sidebar t={tMock} location={mockLocation} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render if nav is enabled but only one store part is displayed and we are on mobile', () => {
    jest.doMock('config/index.json', () => {
      return {
        enabledStoreParts: ['myapps'],
        default: {
          registry: {
            channel: 'stable'
          },
          authorizedLabelLimit: 3
        }
      }
    })
    const mockLocation = {
      search: ''
    }
    const Sidebar = require('ducks/components/Sidebar').Sidebar
    const component = shallow(
      <Sidebar
        t={tMock}
        location={mockLocation}
        breakpoints={{ isMobile: true }}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render if nav is enabled but only one store part is displayed and we are on tablet', () => {
    jest.doMock('config/index.json', () => {
      return {
        enabledStoreParts: ['myapps'],
        default: {
          registry: {
            channel: 'stable'
          },
          authorizedLabelLimit: 3
        }
      }
    })
    const mockLocation = {
      search: ''
    }
    const Sidebar = require('ducks/components/Sidebar').Sidebar
    const component = shallow(
      <Sidebar
        t={tMock}
        location={mockLocation}
        breakpoints={{ isTablet: true }}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
