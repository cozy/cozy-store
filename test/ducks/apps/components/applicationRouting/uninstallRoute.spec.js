'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { useParams } from 'react-router-dom'
import { UninstallRoute } from 'ducks/apps/components/ApplicationRouting/UninstallRoute'

import mockApps from '../../_mockApps'

const getAppMock = params => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn(() => null)
})

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn()
}))

describe('UninstallRoute component', () => {
  it('should display uninstall modal if installed app found', () => {
    // tasky in mockApps is installed and uninstallable
    useParams.mockReturnValue({ appSlug: 'tasky' })
    const props = getProps()
    const component = shallow(<UninstallRoute {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    // photos in mockApps is isInRegistry
    useParams.mockReturnValue({ appSlug: 'photos' })
    const props = getProps(true)
    const component = shallow(<UninstallRoute {...props} />)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo parent if no app found', () => {
    useParams.mockReturnValue({})
    const props = getProps(false, jest.fn())
    const component = shallow(<UninstallRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(component.isEmptyRender()).toBe(true)
  })
})
