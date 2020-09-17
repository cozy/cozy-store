'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { tMock } from '../../../../jestLib/I18n'
import { Details } from 'ducks/apps/components/ApplicationPage/Details'
import { REGISTRY_CHANNELS } from 'ducks/apps'

import mockApp from '../../_mockPhotosRegistryVersion'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'

jest.mock('assets/icons/platforms/icon-ios.svg', () => {
  return '<svg><text>svg icon</text></svg>'
})

jest.mock('assets/icons/platforms/icon-android.svg', () => {
  return '<svg><text>svg icon</text></svg>'
})

const appManifest = mockApp.manifest
const konnectorManifest = mockKonnector.manifest

const getAppProps = () => {
  return {
    t: tMock,
    slug: appManifest.slug,
    description: appManifest.locales.en.long_description,
    changes: appManifest.locales.en.changes,
    app: {
      categories: appManifest.categories,
      langs: appManifest.langs,
      version: '0.1.0-dev123',
      developer: appManifest.developer
    },
    mobileApps: [
      { type: 'ios', url: '' },
      { type: 'android', url: 'https://mock.app' }
    ]
  }
}

const getKonnectorProps = () => {
  return {
    t: tMock,
    description: konnectorManifest.locales.en.long_description,
    changes: konnectorManifest.locales.en.changes,
    app: {
      categories: konnectorManifest.categories,
      langs: konnectorManifest.langs,
      developer: konnectorManifest.developer
    }
  }
}

describe('ApplicationPage details component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be rendered correctly with provided app', () => {
    const component = shallow(<Details {...getAppProps()} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with provided konnector', () => {
    const component = shallow(<Details {...getKonnectorProps()} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly provided app with no description, no platforms, no langs and no changes no version', () => {
    const appProps = Object.assign({}, getAppProps())
    appProps.description = ''
    appProps.changes = ''
    appProps.langs = []
    appProps.mobileApps = []
    appProps.developer = {}
    appProps.version = ''
    const component = shallow(<Details {...appProps} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle channel switching if with installed app from registry provided', async () => {
    jest.doMock('ducks/apps', () => ({
      REGISTRY_CHANNELS,
      getContext: () =>
        Promise.resolve({
          attributes: {
            debug: true
          }
        })
    }))
    // we have to re import to handle previous mocking here
    const MockedDetails = require('ducks/apps/components/ApplicationPage/Details')
      .Details
    const appProps = getAppProps()
    // correctly handled if from registry and installed
    appProps.app.installed = true
    appProps.app.source = `registry://${appProps}/stable`
    const component = shallow(<MockedDetails {...appProps} />)
    await component.instance().toggleChannels()
    component.update()
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should not suggest Dev channel switching if the context is not in debug mode', async () => {
    jest.doMock('ducks/apps', () => ({
      REGISTRY_CHANNELS,
      getContext: () =>
        Promise.resolve({
          attributes: {
            debug: false
          }
        })
    }))
    // we have to re import to handle previous mocking here
    const MockedDetails = require('ducks/apps/components/ApplicationPage/Details')
      .Details
    const appProps = getAppProps()
    // correctly handled if from registry and installed
    appProps.app.installed = true
    appProps.app.source = `registry://${appProps}/stable`
    const component = shallow(<MockedDetails {...appProps} />)
    await component.instance().toggleChannels()
    component.update()
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should not suggest channel switching if the app is not installed', async () => {
    jest.doMock('ducks/apps', () => ({
      REGISTRY_CHANNELS,
      getContext: () =>
        Promise.resolve({
          attributes: {
            debug: true
          }
        })
    }))
    // we have to re import to handle previous mocking here
    const MockedDetails = require('ducks/apps/components/ApplicationPage/Details')
      .Details
    const appProps = getAppProps()
    appProps.app.installed = false
    appProps.app.source = `registry://${appProps}/stable`
    const component = shallow(<MockedDetails {...appProps} />)
    await component.instance().toggleChannels()
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should not suggest channel switching if the installed app is not from registry', async () => {
    jest.doMock('ducks/apps', () => ({
      REGISTRY_CHANNELS,
      getContext: () =>
        Promise.resolve({
          attributes: {
            debug: true
          }
        })
    }))
    // we have to re import to handle previous mocking here
    const MockedDetails = require('ducks/apps/components/ApplicationPage/Details')
      .Details
    const appProps = getAppProps()
    appProps.app.installed = true
    appProps.app.source = `dont://know/source`
    const component = shallow(<MockedDetails {...appProps} />)
    await component.instance().toggleChannels()
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should not suggest channel switching if the app is not from registry and not installed', async () => {
    jest.doMock('ducks/apps', () => ({
      REGISTRY_CHANNELS,
      getContext: () =>
        Promise.resolve({
          attributes: {
            debug: true
          }
        })
    }))
    // we have to re import to handle previous mocking here
    const MockedDetails = require('ducks/apps/components/ApplicationPage/Details')
      .Details
    const appProps = getAppProps()
    appProps.app.installed = false
    appProps.app.source = `dont://know/source`
    const component = shallow(<MockedDetails {...appProps} />)
    await component.instance().toggleChannels()
    expect(component.getElement()).toMatchSnapshot()
  })
})
