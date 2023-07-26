import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import flags from 'cozy-flags'

import { tMock } from '../../../jestLib/I18n'
import { AppInstallation } from 'ducks/apps/components/deprecated/AppInstallation'
import storeConfig from 'config'

import mockRegistryApp from '../_mockPhotosRegistryVersion'

describe('AppInstallation component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(AppInstallation.prototype, 'installApp')
  })
  afterEach(() => {
    AppInstallation.prototype.installApp.mockRestore()
  })

  it('should install automatically the app if the label is skippable and render the loading modal', () => {
    flags('skip-low-permissions', true)
    const mockApp = Object.assign({}, mockRegistryApp, {
      label: storeConfig.default.authorizedLabelLimit
    })
    const mockInstallProp = jest.fn(() => Promise.resolve())
    const { container, getByRole } = render(
      <AppInstallation
        t={tMock}
        appSlug={mockApp.slug}
        app={mockApp}
        onCancel={jest.fn()}
        installApp={mockInstallProp}
      />
    )
    expect(mockInstallProp).toHaveBeenCalledTimes(1)
    expect(AppInstallation.prototype.installApp).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.sto-install-loading')).toBeInTheDocument()
    expect(getByRole('progressbar')).toBeInTheDocument()
    flags('skip-low-permissions', false)
  })

  it('should not install automatically the app if the label is not skippable and render the permissions modal', () => {
    flags('skip-low-permissions', true)
    const mockApp = Object.assign({}, mockRegistryApp, {
      label: storeConfig.default.authorizedLabelLimit + 1
    })
    const mockInstallProp = jest.fn(() => Promise.resolve())
    const { container, getByRole } = render(
      <AppInstallation
        t={tMock}
        appSlug={mockApp.slug}
        app={mockApp}
        onCancel={jest.fn()}
        installApp={mockInstallProp}
      />
    )
    expect(mockInstallProp).not.toHaveBeenCalled()
    expect(AppInstallation.prototype.installApp).not.toHaveBeenCalled()
    expect(container.querySelector('.sto-install-controls')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Install' })).toBeInTheDocument()
    flags('skip-low-permissions', false)
  })
})
