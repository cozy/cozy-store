/* eslint-env jest */

import React from 'react'
import { mount } from 'enzyme'

import AppInstallation from './AppInstallation'

export const testAppInstallationCall = (Component, props) => {
  jest.mock('./AppInstallation')
  mount(<Component {...props} />)

  expect(AppInstallation).toHaveBeenCalledTimes(1)

  const call = AppInstallation.mock.calls[0][0]
  expect(call.appSlug).toBeDefined()
}
