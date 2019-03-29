'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import flags from 'cozy-flags'

import { tMock } from '../../../jestLib/I18n'
import { AppInstallation } from 'ducks/apps/components/AppInstallation'
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
    const component = shallow(
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
    expect(component.getElement()).toMatchSnapshot()
    flags('skip-low-permissions', false)
  })

  it('should not install automatically the app if the label is not skippable and render the permissions modal', () => {
    flags('skip-low-permissions', true)
    const mockApp = Object.assign({}, mockRegistryApp, {
      label: storeConfig.default.authorizedLabelLimit + 1
    })
    const mockInstallProp = jest.fn(() => Promise.resolve())
    const component = shallow(
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
    expect(component.getElement()).toMatchSnapshot()
    flags('skip-low-permissions', false)
  })
})
