'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../../jestLib/I18n'
import { Details } from 'ducks/apps/components/ApplicationPage/Details'

import mockApp from '../../_mockPhotosRegistryVersion'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'

Enzyme.configure({ adapter: new Adapter() })

const appManifest = mockApp.manifest
const konnectorManifest = mockKonnector.manifest

const getAppProps = () => {
  return {
    t: tMock,
    description: appManifest.locales.en.long_description,
    changes: appManifest.locales.en.changes,
    categories: appManifest.categories,
    langs: appManifest.langs,
    mobileApps: [
      { type: 'ios', url: '' },
      { type: 'android', url: 'https://mock.app' }
    ],
    developer: appManifest.developer
  }
}

const getKonnectorProps = () => {
  return {
    t: tMock,
    description: konnectorManifest.locales.en.long_description,
    changes: konnectorManifest.locales.en.changes,
    categories: konnectorManifest.categories,
    langs: konnectorManifest.langs,
    developer: konnectorManifest.developer
  }
}

describe('ApplicationPage details component', () => {
  it('should be rendered correctly with provided app', () => {
    const component = shallow(<Details {...getAppProps()} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with provided konnector', () => {
    const component = shallow(<Details {...getKonnectorProps()} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly provided app with no description, no platforms, no langs and no changes', () => {
    const appProps = Object.assign({}, getAppProps())
    appProps.description = ''
    appProps.changes = ''
    appProps.langs = []
    appProps.mobileApps = []
    appProps.developer = {}
    const component = shallow(<Details {...appProps} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle correctly `display more` behaviour on description part', () => {
    const component = shallow(<Details {...getAppProps()} />)
    component
      .find('.sto-app-description .sto-details-display-more')
      .simulate('click')
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should handle correctly `display more` behaviour on changes part', () => {
    const component = shallow(<Details {...getAppProps()} />)
    component
      .find('.sto-app-changes .sto-details-display-more')
      .simulate('click')
    expect(component.getElement()).toMatchSnapshot()
  })
})
