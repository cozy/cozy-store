'use strict'

/* eslint-env jest */

import { ChannelRoute } from '@/ducks/apps/components/ApplicationRouting/ChannelRoute'
import { shallow } from 'enzyme'
import React from 'react'
import { useParams } from 'react-router-dom'

import mockApps from '../../_mockApps'

const getAppMock = params => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  fetchLatestApp: jest.fn(),
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn(() => null)
})

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn()
}))

describe('ChannelRoute component', () => {
  it('should display install modal if app found and in the registry and installed', () => {
    // collect in mockApps is installed and isInRegistry
    useParams.mockReturnValue({ appSlug: 'collect', channel: 'beta' })
    const props = getProps()
    const component = shallow(<ChannelRoute {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should display install modal if app found and in the registry even if not installed', () => {
    // photos in mockApps is isInRegistry
    useParams.mockReturnValue({ appSlug: 'photos', channel: 'beta' })
    const props = getProps()
    const component = shallow(<ChannelRoute {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    // collect in mockApps is installed and isInRegistry
    useParams.mockReturnValue({ appSlug: 'collect' })
    const props = getProps(true)
    const component = shallow(<ChannelRoute {...props} />)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo parent if no app found', () => {
    useParams.mockReturnValue({})
    const props = getProps(false, jest.fn())
    const component = shallow(<ChannelRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should redirectTo app page if app channel not available', () => {
    // collect in mockApps is installed and isInRegistry
    const params = { appSlug: 'collect', channel: 'jeanluc' }
    useParams.mockReturnValue(params)
    const props = getProps()
    const component = shallow(<ChannelRoute {...props} />)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(
      `/${props.parent}/${params.appSlug}`
    )
    expect(component.isEmptyRender()).toBe(true)
  })
})
