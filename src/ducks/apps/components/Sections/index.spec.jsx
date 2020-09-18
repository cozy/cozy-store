'use strict'

/* eslint-env jest */

import React from 'react'

import CozyClient, { CozyProvider } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { render, fireEvent, act } from '@testing-library/react'
import { tMock } from 'jestLib/I18n'
import { Sections } from 'ducks/apps/components/Sections/Sections'

import mockApps from 'ducks/apps/_mockApps'
import enLocale from '../../../../locales/en.json'
import flag from 'cozy-flags'

const setup = ({ props } = {}) => {
  const client = new CozyClient({})
  const mockOnAppClick = jest.fn()
  const root = render(
    <BreakpointsProvider>
      <CozyProvider client={client}>
        <I18n lang="en" dictRequire={() => enLocale}>
          <Sections
            t={tMock}
            lang="en"
            subtitle="Test Apps"
            apps={mockApps}
            onAppClick={mockOnAppClick}
            error={null}
            location={{ search: '' }}
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
})

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('Search', () => {
  beforeEach(() => {
    flag('store.search', true)
  })

  afterEach(() => {
    flag('store.search', false)
  })

  it('should filter the results', async () => {
    const { root } = setup()
    const input = root.getByPlaceholderText('"SNCF", "telecom", "bills"')
    act(() => {
      fireEvent.change(input, { target: { value: 'Bouil' } })
    })
    await sleep(500)
    expect(() => root.getByText('Trinlane')).toThrow()
    expect(() => root.getByText('Bouilligue')).not.toThrow()
    act(() => {
      fireEvent.change(input, { target: { value: 'trn' } })
    })
    await sleep(500)
    expect(() => root.getByText('Trinlane')).not.toThrow()
    expect(() => root.getByText('Bouilligue')).toThrow()
  })
})
