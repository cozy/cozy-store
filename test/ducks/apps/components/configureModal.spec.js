'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { ConfigureModal } from 'ducks/apps/components/ConfigureModal'

describe('ConfigureModal component', () => {
  const konnector = {
    installed: true,
    slug: 'trinlane',
    type: 'konnector'
  }

  const props = {
    app: konnector,
    dismissAction: jest.fn(),
    onNotInstalled: jest.fn(),
    onSuccess: jest.fn(),
    onWebApp: jest.fn()
  }

  it('renders', () => {
    const component = shallow(<ConfigureModal {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('calls onNotInstalled', () => {
    const uninstalledKonnector = { ...konnector, installed: false }
    const uninstalledProps = { ...props, app: uninstalledKonnector }
    shallow(<ConfigureModal {...uninstalledProps} />)
    expect(uninstalledProps.onNotInstalled.mock.calls.length).toBe(1)
  })

  it('calls onWebApp', () => {
    const webApp = { installed: true, slug: 'photos', type: 'webapp' }
    const appProps = { ...props, app: webApp }
    shallow(<ConfigureModal {...appProps} />)
    expect(appProps.onWebApp.mock.calls.length).toBe(1)
  })
})
