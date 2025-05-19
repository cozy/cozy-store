import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { IntentRedirect } from '@/ducks/components/intents/IntentRedirect'
import React from 'react'
import { MemoryRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  Navigate: jest.fn()
}))

describe('IntentRedirect', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<IntentRedirect />} />
        </Routes>
      </MemoryRouter>
    )
  }
  Navigate.mockImplementation(({ to }) => <a data-testid="Navigate" to={to} />)

  it('should redirect to install page if step is install', () => {
    useLocation.mockReturnValue({ search: '?slug=test-app&step=install' })
    const { getByTestId } = renderWithRouter()

    const navigateElement = getByTestId('Navigate')
    expect(navigateElement).toHaveAttribute('to', '/discover/test-app/install')
  })

  it('should redirect to install page if step is update', () => {
    useLocation.mockReturnValue({ search: '?slug=test-app&step=update' })
    const { getByTestId } = renderWithRouter()

    const navigateElement = getByTestId('Navigate')
    expect(navigateElement).toHaveAttribute('to', '/discover/test-app/install')
  })

  it('should redirect to uninstall page if step is uninstall', () => {
    useLocation.mockReturnValue({ search: '?slug=test-app&step=uninstall' })
    const { getByTestId } = renderWithRouter()

    const navigateElement = getByTestId('Navigate')
    expect(navigateElement).toHaveAttribute(
      'to',
      '/discover/test-app/uninstall'
    )
  })

  it('should redirect to permissions page if step is permissions', () => {
    useLocation.mockReturnValue({ search: '?slug=test-app&step=permissions' })
    const { getByTestId } = renderWithRouter()

    const navigateElement = getByTestId('Navigate')
    expect(navigateElement).toHaveAttribute(
      'to',
      '/discover/test-app/permissions'
    )
  })

  it('should redirect to app page if step is not provided', () => {
    useLocation.mockReturnValue({ search: '?slug=test-app' })
    const { getByTestId } = renderWithRouter()

    const navigateElement = getByTestId('Navigate')
    expect(navigateElement).toHaveAttribute('to', '/discover/test-app')
  })

  it('should redirect to discover page if slug is not provided', () => {
    useLocation.mockReturnValue({ search: '' })
    const { getByTestId } = renderWithRouter()

    const navigateElement = getByTestId('Navigate')
    expect(navigateElement).toHaveAttribute('to', '/discover/')
  })
})
