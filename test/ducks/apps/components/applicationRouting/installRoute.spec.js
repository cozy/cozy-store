'use strict'

/* eslint-env jest */

import { InstallRoute } from '@/ducks/apps/components/ApplicationRouting/InstallRoute'
import { shallow } from 'enzyme'
import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

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
  useSearchParams: jest.fn()
}))

describe('InstallRoute component', () => {
  it('should display install modal if app found in the registry but not installed', () => {
    // photos in mockApps is isInRegistry
    useParams.mockReturnValue({ appSlug: 'photos' })
    useSearchParams.mockReturnValue([{ get: jest.fn() }])
    const props = getProps()
    const component = shallow(<InstallRoute {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should display install modal if app found in the registry installed but with available version', () => {
    // tasky in mockApps is isInRegistry, installed and availableVersion
    useParams.mockReturnValue({ appSlug: 'tasky' })
    useSearchParams.mockReturnValue([{ get: jest.fn() }])
    const props = getProps()
    const component = shallow(<InstallRoute {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    // photos in mockApps is isInRegistry
    useParams.mockReturnValue({ appSlug: 'photos' })
    useSearchParams.mockReturnValue([{ get: jest.fn() }])
    const props = getProps(true)
    const component = shallow(<InstallRoute {...props} />)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo parent if no app found', () => {
    useParams.mockReturnValue({})
    useSearchParams.mockReturnValue([{ get: jest.fn() }])
    const props = getProps(false, jest.fn())
    const component = shallow(<InstallRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo parent if app found but installed without available version', () => {
    useParams.mockReturnValue({ appSlug: 'collect' })
    useSearchParams.mockReturnValue([{ get: jest.fn() }])
    const props = getProps(false, jest.fn())
    const component = shallow(<InstallRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(component.isEmptyRender()).toBe(true)
  })
})
