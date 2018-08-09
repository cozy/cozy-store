'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../../jestLib/I18n'
import { InstallModalContent } from 'ducks/apps/components/Install/InstallModalContent'
import mockApp from '../../_mockPhotosRegistryVersion'

const mockFetchError = new Error('Fetch mock error')

Enzyme.configure({ adapter: new Adapter() })

const getProps = () => ({
  t: tMock,
  app: mockApp
})

describe('InstallModalContent modal component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <InstallModalContent {...getProps()} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should return a spinner if isFetching', () => {
    const component = shallow(
      <InstallModalContent {...getProps()} isFetching />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should have install button busy if isInstalling', () => {
    const component = shallow(
      <InstallModalContent {...getProps()} isInstalling />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not display spinner if isFetching but during a cancel (isCanceling)', () => {
    const component = shallow(
      <InstallModalContent {...getProps()} isFetching isCanceling />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should display error if fetchError', () => {
    const component = shallow(
      <InstallModalContent {...getProps()} fetchError={mockFetchError} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
