'use strict'

/* eslint-env jest */

import { ApplicationPage } from 'ducks/apps/components/ApplicationPage'
import { shallow } from 'enzyme'
import React from 'react'

import { createMockClient } from 'cozy-client'
import { extend as extendI18n } from 'cozy-ui/transpiled/react/I18n'

import { tMock } from '../../../../jestLib/I18n'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'
import mockApp from '../../_mockPhotosRegistryVersion'

const appManifest = mockApp.manifest
const konnectorManifest = mockKonnector.manifest
const mockError = new Error('This is a test error')

const getAppProps = (installed, related, screenshots = []) => {
  // create a mock ref
  const mockRef = React.createRef()
  mockRef.current = document.createElement('div')
  // set app locales from manifest
  extendI18n({ apps: { [appManifest.slug]: appManifest.locales.en } })
  return {
    getApp: () => ({
      ...appManifest,
      installed,
      icon: 'https://mockcozy.cc/registry/photos/icon',
      related,
      screenshots
    }),
    lang: 'en',
    mainPageRef: mockRef,
    parent: '/myapps',
    redirectTo: jest.fn(),
    search: ''
  }
}

const getKonnectorProps = (installed, keepDescription = true) => {
  // create a mock ref
  const mockRef = React.createRef()
  mockRef.current = document.createElement('div')
  // set app locales from manifest
  extendI18n({
    apps: { [konnectorManifest.slug]: konnectorManifest.locales.en }
  })
  const manifest = { ...konnectorManifest }
  if (!keepDescription) {
    delete manifest.short_description
    delete manifest.long_description
  }
  return {
    lang: 'en',
    getApp: () => ({
      ...manifest,
      installed,
      icon: 'https://mockcozy.cc/registry/konnector-trinlane/icon'
    }),
    parent: '/myapps',
    mainPageRef: mockRef,
    search: ''
  }
}

describe('ApplicationPage component', () => {
  it('should be rendered correctly with provided installed app', () => {
    const props = getAppProps(true, 'https://photos.mockcozy.cc')
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with provided installed konnector', () => {
    const props = getKonnectorProps(true)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with app infos from registry (not installed)', () => {
    const props = getAppProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with konnector infos from registry (not installed)', () => {
    const props = getKonnectorProps(false)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with app with screenshots', () => {
    const props = getAppProps(false, undefined, ['<svg></svg>'])
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly without app descriptions', () => {
    const props = getKonnectorProps(false, false)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly on mobile with the scroll feature', () => {
    const client = createMockClient({})
    const props = getAppProps(false, null)
    props.breakpoints = {
      isMobile: true
    }
    const wrapper = shallow(
      <ApplicationPage t={tMock} {...props} client={client} />
    )
    expect(wrapper.getElement()).toMatchSnapshot()
    // should not throw error at initial state
    expect(wrapper.state('displayBarIcon')).toBe(false)
    wrapper.instance().handleScroll()
    expect(wrapper.state('displayBarIcon')).toBe(false)
    // simulate scroll
    props.mainPageRef.current.scrollTop = 150
    wrapper.instance().handleScroll()
    expect(wrapper.state('displayBarIcon')).toBe(true)
    expect(wrapper.getElement()).toMatchSnapshot()
    props.mainPageRef.current.scrollTop = 20
    wrapper.instance().handleScroll()
    expect(wrapper.state('displayBarIcon')).toBe(false)
  })

  it('should render correctly the application page loading if isFetching', () => {
    const props = getAppProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} isFetching {...props} />
    )
      .dive()
      .getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly an error message if fetchError', () => {
    const props = getAppProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} fetchError={mockError} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should put search content on back button URL', () => {
    const props = getAppProps(true, 'https://photos.mockcozy.cc')
    const component = shallow(
      <ApplicationPage
        t={tMock}
        {...props}
        search="type=konnector&category=isp"
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
