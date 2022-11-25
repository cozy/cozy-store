'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { useParams } from 'react-router-dom'
import { InstallRoute } from 'ducks/apps/components/ApplicationRouting/InstallRoute'
import mockApps from '../../_mockApps'

const getAppMock = params => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn(() => null)
})

jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}))

describe('InstallRoute component', () => {
  it('should display install modal if app found in the registry but not installed', () => {
    // photos in mockApps is isInRegistry
    useParams.mockReturnValue({ appSlug: 'photos' })
    const props = getProps()
    const component = shallow(<InstallRoute {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should display install modal if app found in the registry installed but with available version', () => {
    // tasky in mockApps is isInRegistry, installed and availableVersion
    useParams.mockReturnValue({ appSlug: 'tasky' })
    const props = getProps()
    const component = shallow(<InstallRoute {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    // photos in mockApps is isInRegistry
    useParams.mockReturnValue({ appSlug: 'photos' })
    const props = getProps(true)
    const component = shallow(<InstallRoute {...props} />)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo parent if no app found', () => {
    useParams.mockReturnValue({})
    const props = getProps(false, jest.fn())
    const component = shallow(<InstallRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo parent if app found but installed without available version', () => {
    useParams.mockReturnValue({ appSlug: 'collect' })
    const props = getProps(false, jest.fn())
    const component = shallow(<InstallRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(component.isEmptyRender()).toBe(true)
  })
})
