/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'

import { InstallAppIntent } from 'ducks/components/intents/InstallAppIntent'
import AppInstallation from 'ducks/apps/components/AppInstallation'
jest.mock('ducks/apps/components/AppInstallation')

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

  it('should be rendered correctly', () => {
    const componentWrapper = shallow(<InstallAppIntent {...props} />)
    const component = componentWrapper.getElement()

    expect(component).toMatchSnapshot()
  })

  it('calls AppInstallation correctly', () => {
    mount(<InstallAppIntent {...props} />)

    expect(AppInstallation).toHaveBeenCalledTimes(1)

    const call = AppInstallation.mock.calls[0][0]
    expect(call.appSlug).toBeDefined()
  })
})
