import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { extend as extendI18n } from 'cozy-ui/transpiled/react/I18n'

import { tMock } from '../../../../jestLib/I18n'
import { ApplicationPage } from 'ducks/apps/components/ApplicationPage'
import mockApp from '../../_mockPhotosRegistryVersion'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'
import AppLike from '../../../../AppLike'

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
    redirectTo: jest.fn()
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
    mainPageRef: mockRef
  }
}

describe('ApplicationPage component', () => {
  it('should be rendered correctly with provided installed app', () => {
    const props = getAppProps(true, 'https://photos.mockcozy.cc')
    const { getByText } = render(
      <AppLike>
        <ApplicationPage t={tMock} {...props} />
      </AppLike>
    )

    expect(getByText('Cozy Photos')).toBeInTheDocument()
    expect(getByText('Gestionnaire de photos pour Cozy v3')).toBeInTheDocument()
  })

  it('should be rendered correctly with provided installed konnector', () => {
    const props = getKonnectorProps(true)
    const { getByText } = render(
      <AppLike>
        <ApplicationPage t={tMock} {...props} />
      </AppLike>
    )

    expect(getByText('Trinlane')).toBeInTheDocument()
    expect(getByText('A konnector for trinlane')).toBeInTheDocument()
  })

  it('should be rendered correctly with app infos from registry (not installed)', () => {
    const props = getAppProps(false, null)
    const { getByText } = render(
      <AppLike>
        <ApplicationPage t={tMock} {...props} />
      </AppLike>
    )

    expect(getByText('Gestionnaire de photos pour Cozy v3')).toBeInTheDocument()
  })

  it('should be rendered correctly with konnector infos from registry (not installed)', () => {
    const props = getKonnectorProps(false)
    const { getByText } = render(
      <AppLike>
        <ApplicationPage t={tMock} {...props} />
      </AppLike>
    )

    expect(getByText('A konnector for trinlane')).toBeInTheDocument()
  })

  it('should be rendered correctly with app with screenshots', () => {
    const props = getAppProps(false, undefined, ['<svg></svg>'])
    const { container } = render(
      <AppLike>
        <ApplicationPage t={tMock} {...props} />
      </AppLike>
    )
    const res = container.getElementsByClassName('sto-app-images')
    expect(res.length).toBe(1)
  })

  it('should be rendered correctly without konnector descriptions', () => {
    const props = getKonnectorProps(false, false)
    const { queryByText } = render(
      <AppLike>
        <ApplicationPage t={tMock} {...props} />
      </AppLike>
    )
    expect(queryByText('A konnector for trinlane')).toBeNull()
  })

  it('should render correctly the application page loading if isFetching', () => {
    const props = getAppProps(false, null)
    const { getAllByTestId } = render(
      <AppLike>
        <ApplicationPage t={tMock} isFetching {...props} />
      </AppLike>
    )
    const res = getAllByTestId('Placeholder')
    expect(res.length).toBe(24)
  })

  it('should render correctly an error message if fetchError', () => {
    const props = getAppProps(false, null)
    const { getByText } = render(
      <AppLike>
        <ApplicationPage t={tMock} fetchError={mockError} {...props} />
      </AppLike>
    )
    expect(
      getByText(
        'Something went wrong when fetching the application informations. Reason: This is a test error'
      )
    ).toBeInTheDocument()
  })
})
