'use strict'

/* eslint-env jest */

import { render, fireEvent, act } from '@testing-library/react'
import mockApps from 'ducks/apps/_mockApps'
import Sections from 'ducks/apps/components/Sections/Sections'
import React from 'react'
import { useLocation } from 'react-router-dom'

import CozyClient, { CozyProvider } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import enLocale from '../../../../locales/en.json'

jest.mock('lodash/debounce', () => jest.fn(fn => fn))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}))

useLocation.mockImplementation(() => {
  return { pathname: '/discover' }
})

const setup = ({ props } = {}) => {
  const client = new CozyClient({})
  const mockOnAppClick = jest.fn()

  const root = render(
    <BreakpointsProvider>
      <CozyProvider client={client}>
        <I18n lang="en" dictRequire={() => enLocale}>
          <Sections
            subtitle="Test Apps"
            apps={props?.mockApps || mockApps}
            onAppClick={props?.onAppClick || mockOnAppClick}
            error={null}
            {...props}
          />
        </I18n>
      </CozyProvider>
    </BreakpointsProvider>
  )

  return { root }
}

describe('AppsSection component', () => {
  it('should be rendered correctly with apps list, subtitle and onAppClick', () => {
    const { root } = setup()
    expect(() => root.getByText('Transportation')).not.toThrow()
    expect(() => root.getByText('Tasky')).not.toThrow()
    expect(() => root.getByText('Update available')).not.toThrow()
  })

  it('should render correctly render message if error provided', () => {
    const { root } = setup({
      props: { error: new Error('This is a test error') }
    })
    expect(() => root.getByText('This is a test error')).not.toThrow()
  })

  it("should call onAppClick when clicking on the app, if it's not installed", () => {
    const trinlaneApp = mockApps.find(app => app.name === 'Trinlane') || {}
    const mockTrinlaneApp = [{ ...trinlaneApp, installed: false }]
    const mockOnAppClick = jest.fn()
    const { root } = setup({
      props: { onAppClick: mockOnAppClick, mockApps: mockTrinlaneApp }
    })

    expect(() => root.getByText('Trinlane')).not.toThrow()
    fireEvent.click(root.getByText('Trinlane'))
    expect(mockOnAppClick).toBeCalled()
  })

  it("should call onAppClick when clicking on the app, even if it's already installed", () => {
    const trinlaneApp = mockApps.find(app => app.name === 'Trinlane') || {}
    const mockTrinlaneApp = [{ ...trinlaneApp, installed: true }]
    const mockOnAppClick = jest.fn()
    const { root } = setup({
      props: { onAppClick: mockOnAppClick, mockApps: mockTrinlaneApp }
    })

    expect(() => root.getByText('Trinlane')).not.toThrow()
    fireEvent.click(root.getByText('Trinlane'))
    expect(mockOnAppClick).toBeCalled()
  })

  describe('In Intent', () => {
    it("should call onAppClick when clicking on the app, if it's not installed", () => {
      const trinlaneApp = mockApps.find(app => app.name === 'Trinlane') || {}
      const mockTrinlaneApp = [{ ...trinlaneApp, installed: false }]
      const mockOnAppClick = jest.fn()
      const { root } = setup({
        props: {
          intentData: { data: {} },
          onAppClick: mockOnAppClick,
          mockApps: mockTrinlaneApp
        }
      })

      expect(() => root.getByText('Trinlane')).not.toThrow()
      fireEvent.click(root.getByText('Trinlane'))
      expect(mockOnAppClick).toBeCalled()
    })

    it("should not call onAppClick when clicking on the app, if it's already installed", () => {
      const trinlaneApp = mockApps.find(app => app.name === 'Trinlane') || {}
      const mockTrinlaneApp = [{ ...trinlaneApp, installed: true }]
      const mockOnAppClick = jest.fn()
      const { root } = setup({
        props: {
          intentData: { data: {} },
          onAppClick: mockOnAppClick,
          mockApps: mockTrinlaneApp
        }
      })

      expect(() => root.getByText('Trinlane')).not.toThrow()
      fireEvent.click(root.getByText('Trinlane'))
      expect(mockOnAppClick).not.toBeCalled()
    })
  })
})

describe('Search', () => {
  it('should filter the results', async () => {
    const { root } = setup()
    const input = root.getByPlaceholderText('"CAF", "telecom", "bills"')

    act(() => {
      fireEvent.change(input, { target: { value: 'Bouil' } })
    })

    expect(() => root.getByText('Trinlane')).toThrow()
    expect(() => root.getByText('Bouilligue')).not.toThrow()

    act(() => {
      fireEvent.change(input, { target: { value: 'tri' } })
    })

    expect(() => root.getByText('Trinlane')).not.toThrow()
    expect(() => root.getByText('Bouilligue')).toThrow()
  })

  it("should call onAppClick when clicking on the app, if it's not installed", () => {
    const trinlaneApp = mockApps.find(app => app.name === 'Trinlane') || {}
    const mockTrinlaneApp = [{ ...trinlaneApp, installed: false }]
    const mockOnAppClick = jest.fn()
    const { root } = setup({
      props: {
        onAppClick: mockOnAppClick,
        mockApps: mockTrinlaneApp
      }
    })

    const input = root.getByPlaceholderText('"CAF", "telecom", "bills"')
    act(() => {
      fireEvent.change(input, { target: { value: 'Tri' } })
    })
    expect(() => root.getByText('Trinlane')).not.toThrow()

    fireEvent.click(root.getByText('Trinlane'))
    expect(mockOnAppClick).toBeCalled()
  })

  describe('In Intent', () => {
    it("should not call onAppClick when clicking on the app, if it's already installed", () => {
      const trinlaneApp = mockApps.find(app => app.name === 'Trinlane') || {}
      const mockTrinlaneApp = [{ ...trinlaneApp, installed: true }]
      const mockOnAppClick = jest.fn()
      const { root } = setup({
        props: {
          intentData: { data: {} },
          onAppClick: mockOnAppClick,
          mockApps: mockTrinlaneApp
        }
      })

      const input = root.getByPlaceholderText('"CAF", "telecom", "bills"')
      act(() => {
        fireEvent.change(input, { target: { value: 'Tri' } })
      })
      expect(() => root.getByText('Trinlane')).not.toThrow()

      fireEvent.click(root.getByText('Trinlane'))
      expect(mockOnAppClick).not.toBeCalled()
    })
  })
})
