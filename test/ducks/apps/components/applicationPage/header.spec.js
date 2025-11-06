import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'

import CozyClient, { CozyProvider } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import { WebviewIntentProvider } from 'cozy-intent'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import enLocale from '../../../../../src/locales/en.json'
import { tMock } from '../../../../jestLib/I18n'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'
import mockApp from '../../_mockPhotosRegistryVersion'

import { openApp } from '@/ducks/apps'
import { Header } from '@/ducks/apps/components/ApplicationPage/Header'

delete window.location
window.location = { assign: jest.fn() }
window.cozy = {
  containerApp: 'amiral'
}

jest.mock('cozy-device-helper', () => ({
  isFlagshipApp: jest.fn()
}))

jest.mock('ducks/apps', () => ({
  ...jest.requireActual('ducks/apps'),
  openApp: jest.fn()
}))

const mockIntentRedirect = jest.fn()
jest.mock('cozy-interapp', () => {
  return jest.fn().mockImplementation(() => {
    return {
      redirect: mockIntentRedirect
    }
  })
})

const mockIntentCall = jest.fn()
jest.mock('cozy-intent', () => ({
  ...jest.requireActual('cozy-intent'),
  useWebviewIntent: jest.fn().mockImplementation(() => {
    return {
      call: mockIntentCall
    }
  })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}))

const AppLike = ({
  children,
  client,
  webviewService,
  mockOpenApp = jest.fn()
} = {}) => {
  const mockClient = client || new CozyClient({})
  const mockWebviewService = webviewService || {
    call: jest.fn()
  }
  openApp.mockImplementation(mockOpenApp)

  return (
    <MemoryRouter>
      <BreakpointsProvider>
        <WebviewIntentProvider webviewService={mockWebviewService}>
          <CozyProvider client={mockClient}>
            <I18n lang="en" dictRequire={() => enLocale}>
              {children}
            </I18n>
          </CozyProvider>
        </WebviewIntentProvider>
      </BreakpointsProvider>
    </MemoryRouter>
  )
}

describe('ApplicationPage header component', () => {
  beforeEach(() => {
    window.location.assign.mockReset()
    isFlagshipApp.mockReset()
    mockIntentRedirect.mockReset()
    mockIntentCall.mockReset()
    useLocation.mockReturnValue({ search: '' })
  })

  it('should be rendered correctly provided app', () => {
    const { getByText } = render(
      <AppLike>
        <Header
          t={tMock}
          parent="/myapps"
          namePrefix="Cozy"
          name={mockApp.manifest.name}
          description={mockApp.manifest.short_description}
          app={mockApp}
        />
      </AppLike>
    )
    expect(getByText('Cozy Photos')).toBeInTheDocument()
    expect(getByText('Photos manager for Cozy v3')).toBeInTheDocument()
  })

  it('should be rendered correctly provided konnector', () => {
    const { getByText } = render(
      <AppLike>
        <Header
          t={tMock}
          parent="/myapps"
          app={mockKonnector}
          name={mockKonnector.manifest.name}
          description={mockKonnector.manifest.short_description}
        />
      </AppLike>
    )
    expect(getByText('Trinlane')).toBeInTheDocument()
    expect(getByText('A konnector for trinlane')).toBeInTheDocument()
  })

  it('should handle the click on open installed app button', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    appProps.icon = '<svg></svg>'
    appProps.related = '#'
    const mockOpenApp = jest.fn()
    const mockWebviewService = jest.fn()

    const { getByText } = render(
      <AppLike mockOpenApp={mockOpenApp} webviewService={mockWebviewService}>
        <Header
          t={tMock}
          parent="/myapps"
          app={appProps}
          name={appProps.name}
          description={appProps.description}
        />
      </AppLike>
    )
    const button = getByText('Open')
    fireEvent.click(button)

    expect(mockOpenApp).toBeCalledTimes(1)
    expect(mockOpenApp).not.toBeCalledWith(undefined)
  })

  it('should open the connector in amiral app if in amiral container', () => {
    isFlagshipApp.mockImplementation(() => true)
    const connectorProps = Object.assign({}, mockKonnector.manifest)
    connectorProps.installed = true

    const { getByText } = render(
      <AppLike>
        <Header
          t={tMock}
          parent="/myapps"
          app={connectorProps}
          name={connectorProps.name}
          description={connectorProps.description}
          konnectorOpenUri="cozy://"
        />
      </AppLike>
    )

    const button = getByText('Open')
    fireEvent.click(button)

    expect(mockIntentCall).toHaveBeenCalled()
    expect(mockIntentCall).toHaveBeenCalledWith(
      'openApp',
      connectorProps.related,
      connectorProps
    )
    expect(mockIntentRedirect).not.toHaveBeenCalled()
  })

  it('should open the connector in browser if NOT in amiral container', () => {
    isFlagshipApp.mockImplementation(() => false)
    const connectorProps = Object.assign({}, mockKonnector.manifest)
    connectorProps.installed = true

    const { getByText } = render(
      <AppLike>
        <Header
          t={tMock}
          parent="/myapps"
          app={connectorProps}
          name={connectorProps.name}
          description={connectorProps.description}
          konnectorOpenUri="cozy://"
        />
      </AppLike>
    )

    const button = getByText('Open')
    fireEvent.click(button)

    expect(mockIntentCall).not.toHaveBeenCalled()
    expect(mockIntentRedirect).toHaveBeenCalledWith('io.cozy.accounts', {
      konnector: connectorProps.slug
    })
  })

  it('should disable the install button if maintenance', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.maintenance = {}
    const { getByText } = render(
      <AppLike>
        <Header
          t={tMock}
          parent="/discover"
          app={appProps}
          name={appProps.name}
          description={appProps.description}
        />
      </AppLike>
    )
    const installButton = getByText('Install')
    const isPrevented = fireEvent.click(installButton)

    expect(isPrevented).toBe(false)
  })

  it('should disable the uninstall button for installed app if not uninstallable', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    appProps.icon = '<svg></svg>'
    appProps.uninstallable = false
    const { getByText } = render(
      <AppLike>
        <Header
          t={tMock}
          parent="/discover"
          app={appProps}
          name={appProps.name}
          description={appProps.description}
        />
      </AppLike>
    )

    const uninstallButton = getByText('Uninstall')
    const isPrevented = fireEvent.click(uninstallButton)

    expect(isPrevented).toBe(false)
  })

  it('should disable the uninstall button an app is installing (updating)', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    const { getByText } = render(
      <AppLike>
        <Header
          t={tMock}
          parent="/discover"
          app={appProps}
          name={appProps.name}
          description={appProps.description}
          isInstalling
        />
      </AppLike>
    )

    const uninstallButton = getByText('Uninstall')
    const isPrevented = fireEvent.click(uninstallButton)

    expect(isPrevented).toBe(false)
  })
})
