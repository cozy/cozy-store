import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { StoreSidebar as StoreSidebarOriginal } from '@/ducks/components/Sidebar'
import React from 'react'
import { useLocation } from 'react-router-dom'

import AppLike from '../AppLike'
import { tMock } from '../jestLib/I18n'

/* eslint-disable react/display-name */
jest.mock('ducks/apps/Containers', () => ({
  ...jest.requireActual('ducks/apps/Containers'),
  Discover: () => <div data-testid="Discover" />,
  MyApplications: () => <div data-testid="MyApplications" />,
  SidebarCategories: () => <div data-testid="SidebarCategories" />
}))
/* eslint-enable react/display-name */

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}))

const setup = ({ searchParams = '', breakpoints, refreshComponent } = {}) => {
  const StoreSidebar = refreshComponent
    ? require('ducks/components/Sidebar').StoreSidebar
    : StoreSidebarOriginal

  useLocation.mockImplementation(() => {
    return { search: searchParams }
  })

  return render(
    <AppLike>
      <StoreSidebar t={tMock} {...(breakpoints && { breakpoints })} />
    </AppLike>
  )
}

describe('StoreSidebar component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be rendered correctly', () => {
    const { getByRole } = setup({ searchParams: '' })

    expect(getByRole('complementary')).toBeInTheDocument() // Implicit ARIA role of <aside> element
  })

  it('should not render if nav is disabled using search flag', () => {
    const { queryByRole } = setup({ searchParams: '?nav=false' })

    expect(queryByRole('complementary')).toBeNull() // Implicit ARIA role of <aside> element
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

    const { queryByRole } = setup({
      breakpoints: { isMobile: true },
      refreshComponent: true
    })

    expect(queryByRole('complementary')).toBeNull() // Implicit ARIA role of <aside> element
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

    const { queryByRole } = setup({
      breakpoints: { isTablet: true },
      refreshComponent: true
    })

    expect(queryByRole('complementary')).toBeNull() // Implicit ARIA role of <aside> element
  })
})
