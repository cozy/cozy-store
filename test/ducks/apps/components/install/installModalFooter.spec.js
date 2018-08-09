'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../../jestLib/I18n'
import { InstallModalFooter } from 'ducks/apps/components/Install/InstallModalFooter'
import mockApp from '../../_mockPhotosRegistryVersion'

const mockInstallError = new Error('Install mock error')

Enzyme.configure({ adapter: new Adapter() })

const getProps = () => ({
  t: tMock,
  app: mockApp
})

describe('InstallModalFooter modal component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <InstallModalFooter {...getProps()} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should installApp on install button click', async () => {
    const props = getProps()
    props.channel = 'beta'
    props.installApp = jest.fn(() => Promise.resolve())
    const component = shallow(
      <InstallModalFooter {...props} installError={mockInstallError} />
    )
    const installButton = component.find('button')
    await installButton.simulate('click')
    expect(props.installApp.mock.calls.length).toBe(1)
    expect(props.installApp.mock.calls[0]).toMatchSnapshot()
  })

  it('should handle error when installApp', async () => {
    const props = getProps()
    props.channel = 'beta'
    const propsWithoutOnError = Object.assign({}, props)
    props.installApp = jest.fn(() => Promise.reject(mockInstallError))
    propsWithoutOnError.installApp = jest.fn(() =>
      Promise.reject(mockInstallError)
    )
    props.onError = jest.fn()
    const component = shallow(<InstallModalFooter {...props} />)
    const installButton = component.find('button')
    await installButton.simulate('click')
    expect(props.installApp.mock.calls.length).toBe(1)
    expect(props.installApp.mock.calls[0]).toMatchSnapshot()
    expect(props.onError.mock.calls.length).toBe(1)
    expect(props.onError.mock.calls[0][0]).toBe(mockInstallError)
    // should throw the error if onError not provided
    const component2 = shallow(<InstallModalFooter {...propsWithoutOnError} />)
    const installButton2 = component2.find('button')
    installButton2.simulate('click')
    expect(propsWithoutOnError.installApp.mock.calls.length).toBe(1)
    expect(propsWithoutOnError.installApp.mock.calls[0]).toMatchSnapshot()
  })

  it('should return nothing if isFetching', () => {
    const component = shallow(
      <InstallModalFooter {...getProps()} isFetching />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should have install button busy if isInstalling', () => {
    const component = shallow(
      <InstallModalFooter {...getProps()} isInstalling />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should have install button busy if isFetching but during a cancel (isCanceling)', () => {
    const component = shallow(
      <InstallModalFooter {...getProps()} isFetching isCanceling />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should display error if installError', () => {
    const component = shallow(
      <InstallModalFooter {...getProps()} installError={mockInstallError} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
