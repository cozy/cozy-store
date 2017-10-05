'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../jestLib/I18n'
import { ApplicationDetails } from '../../../src/ducks/apps/components/ApplicationDetails'

import mockApps from './_mockApps'

describe('ApplicationDetails component', () => {
  it('should be rendered correctly provided app', () => {
    const installedMockApp = mockApps[0]
    const component = shallow(
      <ApplicationDetails t={tMock} app={installedMockApp} parent='/myapps' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly provided app with broken icon and no editor', () => {
    const installedMockApp = mockApps[0]
    installedMockApp.icon = ''
    installedMockApp.editor = ''
    const component = shallow(
      <ApplicationDetails t={tMock} app={installedMockApp} parent='/myapps' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should handle correctly openApp on open button click for installed app', () => {
    const installedMockApp = mockApps.filter(a => a.installed)[0]
    const component = shallow(
      <ApplicationDetails t={tMock} app={installedMockApp} parent='/myapps' />
    )
    window.location.assign = jest.fn()
    component.find('button').simulate('click')
    expect(window.location.assign).toBeCalledWith(installedMockApp.related)
  })
})
