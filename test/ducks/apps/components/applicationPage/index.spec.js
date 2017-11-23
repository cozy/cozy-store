'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../../jestLib/I18n'
import { ApplicationPage } from 'ducks/apps/components/ApplicationPage'

import mockApp from '../../_mockPhotosRegistryVersion'

const appManifest = mockApp.manifest
const mockError = new Error('This is a test error')

const getProps = (installed, related) => {
  return {
    lang: 'en',
    app: Object.assign({}, appManifest, {
      installed,
      icon: 'https://mockcozy.cc/registry/photos/icon',
      related
    }),
    parent: '/myapps'
  }
}

describe('ApplicationPage component', () => {
  it('should be rendered correctly with provided installed app', () => {
    const props = getProps(true, 'https://photos.mockcozy.cc')
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with app infos from registry (not installed)', () => {
    const props = getProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a spinner if isFetching', () => {
    const props = getProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} isFetching {...props} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly an error message if fetchError', () => {
    const props = getProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} fetchError={mockError} {...props} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
