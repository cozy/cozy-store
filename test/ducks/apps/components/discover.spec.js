'use strict'

/* eslint-env jest */
/* global cozy */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from 'jestLib/I18n'
import { Discover } from 'ducks/apps/components/Discover'

import mockApps from 'ducks/apps/_mockApps'

const { BarCenter } = cozy.bar

const mockError = new Error('This is a test error')

const mockRegistyApps = mockApps
  .filter(app => app.isInRegistry)
  .filter(
    app => Array.isArray(app.versions.stable) && !!app.versions.stable.length
  )

const getMockProps = (
  apps = mockRegistyApps,
  isFetching = false,
  fetchError = null
) => ({
  fetchApps: jest.fn(),
  apps,
  isFetching,
  fetchError,
  actionError: null,
  navigate: jest.fn()
})

describe('Discover component', () => {
  it('should be rendered correctly with apps', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with apps and URL search params', () => {
    const mockProps = getMockProps(
      mockRegistyApps,
      false,
      null,
      { isExact: true },
      { search: '?category=cozy' }
    )
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a spinner if apps is fetching', () => {
    const mockProps = getMockProps([], true, null)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should display error from props correctly', () => {
    const mockProps = getMockProps([], false, mockError)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should define the correct onAppClick function to pass to sections', () => {
    const mockProps = getMockProps()
    const component = shallow(<Discover t={tMock} {...mockProps} />)
    const instance = component.instance()
    instance.onAppClick(mockRegistyApps[0].slug)
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith(`/discover/collect`)
  })

  it('should define the correct onAppClick function to pass to sections with redirectAfterInstall search params, and so replace __APPSLUG__', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover
        t={tMock}
        {...mockProps}
        searchParams={{
          get: () =>
            'http://mespapiers.mycozy.cloud/#/paper/files/energy_invoice/harvest/'
        }}
      />
    )
    const instance = component.instance()
    instance.onAppClick(mockRegistyApps[0].slug)
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith(
      `/discover/collect?redirectAfterInstall=http%3A%2F%2Fmespapiers.mycozy.cloud%2F%23%2Fpaper%2Ffiles%2Fenergy_invoice%2Fharvest%2F%3FconnectorSlug%3Dcollect`
    )
  })

  it('should encode uri when using redirectAfterInstall search params', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover
        t={tMock}
        {...mockProps}
        searchParams={{
          get: () => 'http://mydomain/#/paper?param1=val1&param2=val2'
        }}
      />
    )
    const instance = component.instance()
    instance.onAppClick(mockRegistyApps[0].slug)
    expect(mockProps.navigate).toHaveBeenCalledTimes(1)
    expect(mockProps.navigate).toHaveBeenCalledWith(
      `/discover/collect?redirectAfterInstall=http%3A%2F%2Fmydomain%2F%23%2Fpaper%3Fparam1%3Dval1%26param2%3Dval2%3FconnectorSlug%3Dcollect`
    )
  })

  it('should use BarCenter from cozy-bar in mobile view only', () => {
    const mockProps = getMockProps()
    const component = shallow(<Discover t={tMock} {...mockProps} />)
    expect(component.find(BarCenter).length).toBe(0)
    const componentMobile = shallow(
      <Discover t={tMock} breakpoints={{ isMobile: true }} {...mockProps} />
    )
    expect(componentMobile.find(BarCenter).length).toBe(1)
    expect(componentMobile.getElement()).toMatchSnapshot()
  })
})
