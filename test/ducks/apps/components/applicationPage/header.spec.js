'use strict'

/* eslint-env jest */

import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, fireEvent } from '@testing-library/react'
import { shallow } from 'enzyme'

import CozyClient, { CozyProvider } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import { WebviewIntentProvider } from 'cozy-intent'

import Button from 'cozy-ui/transpiled/react/Button'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import I18n from 'cozy-ui/transpiled/react/I18n'

import enLocale from '../../../../../src/locales/en.json'
import { tMock } from '../../../../jestLib/I18n'
import { Header } from 'ducks/apps/components/ApplicationPage/Header'

import mockApp from '../../_mockPhotosRegistryVersion'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'

delete window.location
window.location = { assign: jest.fn() }
window.cozy = {
  containerApp: 'amiral'
}

jest.mock('cozy-device-helper', () => ({
  isFlagshipApp: jest.fn()
}))

const mockIntentRedirect = jest.fn()
jest.mock('cozy-interapp', () => {
  return jest.fn().mockImplementation(() => {
    return {
      redirect: mockIntentRedirect
    }
  })
})

const AppLike = ({ children, client, webviewService }) => (
  <MemoryRouter>
    <BreakpointsProvider>
      <WebviewIntentProvider webviewService={webviewService}>
        <CozyProvider client={client}>
          <I18n lang="en" dictRequire={() => enLocale}>
            {children}
          </I18n>
        </CozyProvider>
      </WebviewIntentProvider>
    </BreakpointsProvider>
  </MemoryRouter>
)

describe('ApplicationPage header component', () => {
  beforeEach(() => {
    window.location.assign.mockReset()
    isFlagshipApp.mockReset()
    mockIntentRedirect.mockReset()
  })

  it('should be rendered correctly provided app', () => {
    const component = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        namePrefix="Cozy"
        name={mockApp.name}
        description={mockApp.description}
        app={mockApp}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly provided konnector', () => {
    const component = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        app={mockKonnector}
        name={mockKonnector.name}
        description={mockKonnector.description}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly provided app with broken icon and no editor', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.icon = ''
    appProps.editor = ''
    const component = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle the click on open installed app button', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    appProps.icon = '<svg></svg>'
    appProps.related = '#'
    const wrapper = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    )
    // open button is the first one
    wrapper
      .find(Button)
      .at(0)
      .simulate('click')
    expect(window.location.assign.mock.calls.length).toBe(1)
    expect(window.location.assign.mock.calls[0][0]).toBe('#')
  })

  it('should open the connector in amiral app if in amiral container', () => {
    isFlagshipApp.mockImplementation(() => true)

    const client = new CozyClient({})

    const connectorProps = Object.assign({}, mockKonnector.manifest)
    connectorProps.installed = true

    const mockWebviewService = {
      call: jest.fn()
    }

    const { queryByText } = render(
      <AppLike client={client} webviewService={mockWebviewService}>
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

    const button = queryByText(enLocale.app_page.konnector.open)
    fireEvent.click(button)

    expect(mockWebviewService.call).toHaveBeenCalledWith(
      'openApp',
      connectorProps.related,
      connectorProps
    )
    expect(mockIntentRedirect).not.toHaveBeenCalled()
  })

  it('should open the connector in browser if NOT in amiral container', () => {
    isFlagshipApp.mockImplementation(() => false)

    const client = new CozyClient({})

    const connectorProps = Object.assign({}, mockKonnector.manifest)
    connectorProps.installed = true

    const mockWebviewService = {
      call: jest.fn()
    }

    const { queryByText } = render(
      <AppLike client={client} webviewService={mockWebviewService}>
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

    const button = queryByText(enLocale.app_page.konnector.open)
    fireEvent.click(button)

    expect(mockWebviewService.call).not.toHaveBeenCalled()
    expect(mockIntentRedirect).toHaveBeenCalledWith('io.cozy.accounts', {
      konnector: connectorProps.slug
    })
  })

  it('should disable the install button if maintenance', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.maintenance = {}
    const wrapper = shallow(
      <Header
        t={tMock}
        parent="/discover"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    )
    const mockEvent = {
      preventDefault: jest.fn()
    }
    // install button is the only one here
    const installButton = wrapper.find(Button)
    expect(installButton.props().disabled).toBe(true)
    wrapper.find(Button).simulate('click', mockEvent)
    expect(mockEvent.preventDefault.mock.calls.length).toBe(1)
  })

  it('should disable the uninstall button for installed app if not uninstallable', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    appProps.icon = '<svg></svg>'
    appProps.uninstallable = false
    const wrapper = shallow(
      <Header
        t={tMock}
        parent="/discover"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    )
    const mockEvent = {
      preventDefault: jest.fn()
    }
    // uninstall button is the second one
    const uninstallButton = wrapper.find(Button).at(1)
    expect(uninstallButton.props().disabled).toBe(true)
    uninstallButton.simulate('click', mockEvent)
    expect(mockEvent.preventDefault.mock.calls.length).toBe(1)
  })

  it('should disable the uninstall button an app is installing (updating)', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    const wrapper = shallow(
      <Header
        t={tMock}
        parent="/discover"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
        isInstalling
      />
    )
    const mockEvent = {
      preventDefault: jest.fn()
    }
    // uninstall button is the second one
    const uninstallButton = wrapper.find(Button).at(1)
    expect(uninstallButton.props().disabled).toBe(true)
    uninstallButton.simulate('click', mockEvent)
    expect(mockEvent.preventDefault.mock.calls.length).toBe(1)
  })

  it('should display a placeholder if app icon is still fetching', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.iconToLoad = true
    const component = shallow(
      <Header
        t={tMock}
        parent="/discover"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
