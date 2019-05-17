/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'

import { InstallAppIntent } from 'ducks/components/intents/InstallAppIntent'
import AppInstallation from 'ducks/apps/components/AppInstallation'
import CozyClient, { CozyProvider } from 'cozy-client'

jest.mock('ducks/apps/components/AppInstallation')

AppInstallation.mockImplementation(() => null)

describe('InstallAppIntent component', () => {
  const props = {
    app: {
      slug: 'drive'
    },
    appData: {
      cozyAppEditor: 'Cozy',
      cozyAppName: 'Drive',
      cozyIconPath: '/path/to/icon'
    },
    initAppIntent: jest.fn()
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  const client = new CozyClient({})

  it('should be rendered correctly', () => {
    const componentWrapper = shallow(
      <CozyProvider client={client}>
        <InstallAppIntent {...props} />
      </CozyProvider>
    ).dive()
    const component = componentWrapper.getElement()

    expect(component).toMatchSnapshot()
  })

  it('should render AppInstallation correctly', () => {
    const root = mount(
      <CozyProvider client={client}>
        <InstallAppIntent {...props} />
      </CozyProvider>
    )

    expect(root.find(AppInstallation).length).toBe(1)
  })
})
