'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../jestLib/I18n'
import { StoreSidebar } from 'ducks/components/Sidebar'
import { AppRouter } from 'ducks/components/AppRouter'

describe('StoreSidebar component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be rendered correctly', () => {
    const mockLocation = {
      search: ''
    }
    const component = shallow(
      <AppRouter>
        <StoreSidebar t={tMock} location={mockLocation} />
      </AppRouter>
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render if nav is disabled using search flag', () => {
    const mockLocation = {
      search: '?nav=false'
    }
    const component = shallow(
      <AppRouter>
        <StoreSidebar t={tMock} location={mockLocation} />
      </AppRouter>
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render if nav is enabled but only one store part is displayed and we are on mobile', () => {
    jest.doMock('config/index.json', () => {
      return {
        enabledPages: ['myapps'],
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
    const StoreSidebar = require('ducks/components/Sidebar').StoreSidebar
    const component = shallow(
      <AppRouter>
        <StoreSidebar
          t={tMock}
          location={mockLocation}
          breakpoints={{ isMobile: true }}
        />
      </AppRouter>
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render if nav is enabled but only one store part is displayed and we are on tablet', () => {
    jest.doMock('config/index.json', () => {
      return {
        enabledPages: ['myapps'],
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
    const StoreSidebar = require('ducks/components/Sidebar').StoreSidebar
    const component = shallow(
      <AppRouter>
        <StoreSidebar
          t={tMock}
          location={mockLocation}
          breakpoints={{ isTablet: true }}
        />
      </AppRouter>
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
