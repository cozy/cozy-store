'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'

import { ChannelRoute } from 'ducks/apps/components/ApplicationRouting/ChannelRoute'

import mockApps from '../../_mockApps'

const getAppMock = ({ params }) => mockApps.find(a => a.slug === params.appSlug)

const getProps = (isFetching = false, getApp = getAppMock) => ({
  fetchLatestApp: jest.fn(),
  isFetching,
  parent: 'myapps',
  getApp,
  redirectTo: jest.fn(() => null)
})

describe('ChannelRoute component', () => {
  it('should display install modal if app found and in the registry and installed', () => {
    const props = getProps()
    const component = shallow(<ChannelRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'collect', channel: 'beta' } }
    }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toMatchSnapshot()
  })

  it('should display install modal if app found and in the registry even if not installed', () => {
    const props = getProps()
    const component = shallow(<ChannelRoute {...props} />)
    const route = component.find(Route).getElement()
    // photos in mockApps is isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'photos', channel: 'beta' } }
    }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toMatchSnapshot()
  })

  it('should display nothing if isFetching', () => {
    const props = getProps(true)
    const component = shallow(<ChannelRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = { match: { params: { appSlug: 'collect' } } }
    const resultComponent = route.props.render(routeProps)
    expect(resultComponent).toBe(null)
  })

  it('should redirectTo parent if no app found', () => {
    const props = getProps(false, jest.fn())
    const component = shallow(<ChannelRoute {...props} />)
    const route = component.find(Route).getElement()
    const routeProps = { match: { params: {} } }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(`/${props.parent}`)
    expect(resultComponent).toBe(null)
  })

  it('should redirectTo app page if app channel not available', () => {
    const props = getProps()
    const component = shallow(<ChannelRoute {...props} />)
    const route = component.find(Route).getElement()
    // collect in mockApps is installed and isInRegistry
    const routeProps = {
      match: { params: { appSlug: 'collect', channel: 'jeanluc' } }
    }
    const resultComponent = route.props.render(routeProps)
    expect(props.redirectTo.mock.calls.length).toBe(1)
    expect(props.redirectTo.mock.calls[0][0]).toBe(
      `/${props.parent}/${routeProps.match.params.appSlug}`
    )
    expect(resultComponent).toBe(null)
  })
})
