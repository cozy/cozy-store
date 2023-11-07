'use strict'

/* eslint-env jest */

import { render, fireEvent } from '@testing-library/react'
import { getContext } from 'ducks/apps'
import { Details } from 'ducks/apps/components/ApplicationPage/Details'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import CozyClient, { CozyProvider } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import enLocale from '../../../../../src/locales/en.json'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'
import mockApp from '../../_mockPhotosRegistryVersion'

jest.mock('assets/icons/platforms/icon-ios.svg', () => {
  return '<svg><text>svg icon</text></svg>'
})

jest.mock('assets/icons/platforms/icon-android.svg', () => {
  return '<svg><text>svg icon</text></svg>'
})

jest.mock('ducks/apps')

const appManifest = mockApp.manifest
const konnectorManifest = mockKonnector.manifest

const getAppProps = () => {
  return {
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

const getKonnectorProps = ({ withIntent } = {}) => {
  return {
    description: konnectorManifest.locales.en.long_description,
    changes: konnectorManifest.locales.en.changes,
    app: {
      categories: konnectorManifest.categories,
      langs: konnectorManifest.langs,
      developer: konnectorManifest.developer
    },
    ...(withIntent && {
      intentData: {
        data: {
          slug: 'slug',
          category: 'category'
        },
        appData: {}
      }
    })
  }
}

const AppLike = ({ children } = {}) => {
  const mockClient = new CozyClient({})

  return (
    <MemoryRouter>
      <CozyProvider client={mockClient}>
        <I18n lang="en" dictRequire={() => enLocale}>
          {children}
        </I18n>
      </CozyProvider>
    </MemoryRouter>
  )
}

describe('ApplicationPage details component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be rendered correctly with provided app', () => {
    const { container } = render(
      <AppLike>
        <Details {...getAppProps()} />
      </AppLike>
    )
    expect(container).toMatchSnapshot()
  })

  it('should be rendered correctly with provided konnector', () => {
    const { container } = render(
      <AppLike>
        <Details {...getKonnectorProps()} />
      </AppLike>
    )
    expect(container).toMatchSnapshot()
  })

  it('should be rendered correctly with provided konnector in Intent', () => {
    const { container } = render(
      <AppLike>
        <Details {...getKonnectorProps({ withIntent: true })} />
      </AppLike>
    )
    expect(container).toMatchSnapshot()
  })

  it('should be rendered correctly provided app with no description, no platforms, no langs and no changes no version', () => {
    const appProps = Object.assign({}, getAppProps())
    appProps.description = ''
    appProps.changes = ''
    appProps.langs = []
    appProps.mobileApps = []
    appProps.developer = {}
    appProps.version = ''
    const { container } = render(
      <AppLike>
        <Details {...appProps} />
      </AppLike>
    )
    expect(container).toMatchSnapshot()
  })

  it('should handle channel switching if with installed app from registry provided', async () => {
    getContext.mockResolvedValue({
      attributes: {
        debug: true
      }
    })
    const appProps = getAppProps()
    // correctly handled if from registry and installed
    appProps.app.installed = true
    appProps.app.source = `registry://${appProps}/stable`
    const { container, getByTestId, findByTestId } = render(
      <AppLike>
        <Details {...appProps} />
      </AppLike>
    )

    const button = getByTestId('toggleChannels')

    fireEvent.dblClick(button)
    await findByTestId('betaToggle')
    await findByTestId('devToggle')

    expect(container).toMatchSnapshot()
  })

  it('should not suggest Dev channel switching if the context is not in debug mode', async () => {
    getContext.mockResolvedValue({
      attributes: {
        debug: false
      }
    })
    const appProps = getAppProps()
    // correctly handled if from registry and installed
    appProps.app.installed = true
    appProps.app.source = `registry://${appProps}/stable`
    const { container, getByTestId, findByTestId } = render(
      <AppLike>
        <Details {...appProps} />
      </AppLike>
    )

    const button = getByTestId('toggleChannels')
    fireEvent.dblClick(button)

    await findByTestId('betaToggle')

    expect(container).toMatchSnapshot()
  })

  it('should not suggest channel switching if the app is not installed', async () => {
    getContext.mockResolvedValue({
      attributes: {
        debug: true
      }
    })
    const appProps = getAppProps()
    appProps.app.installed = false
    appProps.app.source = `registry://${appProps}/stable`
    const { container, getByTestId } = render(
      <AppLike>
        <Details {...appProps} />
      </AppLike>
    )

    const button = getByTestId('toggleChannels')
    fireEvent.dblClick(button)

    expect(container).toMatchSnapshot()
  })

  it('should not suggest channel switching if the installed app is not from registry', async () => {
    getContext.mockResolvedValue({
      attributes: {
        debug: true
      }
    })
    const appProps = getAppProps()
    appProps.app.installed = true
    appProps.app.source = `dont://know/source`
    const { container, getByTestId } = render(
      <AppLike>
        <Details {...appProps} />
      </AppLike>
    )

    const button = getByTestId('toggleChannels')
    fireEvent.dblClick(button)

    expect(container).toMatchSnapshot()
  })

  it('should not suggest channel switching if the app is not from registry and not installed', async () => {
    getContext.mockResolvedValue({
      attributes: {
        debug: true
      }
    })
    const appProps = getAppProps()
    appProps.app.installed = false
    appProps.app.source = `dont://know/source`
    const { container, getByTestId } = render(
      <AppLike>
        <Details {...appProps} />
      </AppLike>
    )

    const button = getByTestId('toggleChannels')
    fireEvent.dblClick(button)

    expect(container).toMatchSnapshot()
  })
})
