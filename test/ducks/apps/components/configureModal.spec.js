'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { ConfigureModal } from 'ducks/apps/components/ConfigureModal'
import CozyClient from 'cozy-client'

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

  let component

  const setup = props => {
    const client = new CozyClient({
      stackClient: { uri: 'https://cozy.tools' }
    })

    component = shallow(
      <ConfigureModal {...props} client={client} />
    ).getElement()
  }

  it('renders', () => {
    setup(props)
    expect(component).toMatchSnapshot()
  })

  it('calls onNotInstalled', () => {
    const uninstalledKonnector = { ...konnector, installed: false }
    const uninstalledProps = { ...props, app: uninstalledKonnector }
    setup(uninstalledProps)
    expect(uninstalledProps.onNotInstalled.mock.calls.length).toBe(1)
  })

  it('calls onWebApp', () => {
    const webApp = { installed: true, slug: 'photos', type: 'webapp' }
    const appProps = { ...props, app: webApp }
    setup(appProps)
    expect(appProps.onWebApp.mock.calls.length).toBe(1)
  })
})
