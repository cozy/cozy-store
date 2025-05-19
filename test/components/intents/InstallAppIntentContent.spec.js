import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import InstallAppIntentContent from '@/ducks/components/intents/InstallAppIntentContent'
import React from 'react'

import CozyClient, { CozyProvider } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import enLocale from '../../../src/locales/en.json'

jest.mock('ducks/components/intents/OpenAppsIntentRoutes', () => () => (
  <div data-testid="OpenAppsIntentRoutes" />
))
jest.mock('ducks/apps/components/AppInstallation', () => () => (
  <div data-testid="AppInstallation" />
))
jest.mock('ducks/apps/components/InstallSuccess', () => () => (
  <div data-testid="InstallSuccess" />
))

const AppLike = ({ children } = {}) => {
  const mockClient = new CozyClient({})

  return (
    <CozyProvider client={mockClient}>
      <I18n lang="en" dictRequire={() => enLocale}>
        {children}
      </I18n>
    </CozyProvider>
  )
}

const setup = ({
  slug = undefined,
  category = undefined,
  qualificationLabels = undefined,
  pageToDisplay = undefined,
  isInstalled = false,
  hasWebappSucceed = false
} = {}) => {
  const data = { pageToDisplay, category, slug, qualificationLabels }
  const props = {
    data,
    isInstalled,
    app: {},
    appData: {},
    installApp: jest.fn(),
    hasWebappSucceed,
    isInstalling: '',
    onCancel: jest.fn(),
    onTerminate: jest.fn()
  }

  return render(
    <AppLike>
      <InstallAppIntentContent {...props} />
    </AppLike>
  )
}

describe('InstallAppIntentContent component', () => {
  describe('App is installed', () => {
    it('should be render null if "hasWebappSucceed" prop is falsy', () => {
      const { queryByTestId } = setup({
        isInstalled: true,
        hasWebappSucceed: false
      })
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('OpenAppsIntentRoutes')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })
    it('should be render null if "hasWebappSucceed" prop is truthy', () => {
      const { getByTestId, queryByTestId } = setup({
        isInstalled: true,
        hasWebappSucceed: true
      })
      expect(getByTestId('InstallSuccess')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('OpenAppsIntentRoutes')).toBeNull()
    })
  })

  describe('App is not installed', () => {
    it('should be render AppInstallation if "pageToDisplay", "qualificationLabels" & "category" props are falsy', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: undefined,
        category: undefined,
        qualificationLabels: undefined
      })
      expect(getByTestId('AppInstallation')).toBeInTheDocument()
      expect(queryByTestId('OpenAppsIntentRoutes')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })

    it('should be render OpenAppsIntentRoutes if "pageToDisplay" prop is defined & not equal to "permissions"', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: 'details',
        category: undefined,
        qualificationLabels: undefined
      })
      expect(getByTestId('OpenAppsIntentRoutes')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })

    it('should be render OpenAppsIntentRoutes if "category" prop is truthy even if "pageToDisplay" is undefined', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: undefined,
        category: 'energy',
        qualificationLabels: undefined
      })
      expect(getByTestId('OpenAppsIntentRoutes')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })

    it('should be render OpenAppsIntentRoutes if "category" prop is truthy even if "pageToDisplay" is et to "permission"', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: 'permissions',
        category: 'energy',
        qualificationLabels: undefined
      })
      expect(getByTestId('OpenAppsIntentRoutes')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })

    it('should be render OpenAppsIntentRoutes if "category" & "qualificationLabels" props are truthy even if "pageToDisplay" is undefined', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: undefined,
        category: 'energy',
        qualificationLabels: 'pay_sheet'
      })
      expect(getByTestId('OpenAppsIntentRoutes')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })

    it('should be render OpenAppsIntentRoutes if "category" & "qualificationLabels" props are truthy even if "pageToDisplay" is et to "permission"', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: 'permissions',
        category: 'energy',
        qualificationLabels: 'pay_sheet'
      })
      expect(getByTestId('OpenAppsIntentRoutes')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })

    it('should be render OpenAppsIntentRoutes if "qualificationLabels" prop is truthy even if "pageToDisplay" is undefined', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: undefined,
        category: undefined,
        qualificationLabels: 'pay_sheet'
      })
      expect(getByTestId('OpenAppsIntentRoutes')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })

    it('should be render OpenAppsIntentRoutes if "qualificationLabels" prop is truthy even if "pageToDisplay" is et to "permission"', () => {
      const { getByTestId, queryByTestId } = setup({
        pageToDisplay: 'permissions',
        category: undefined,
        qualificationLabels: 'pay_sheet'
      })
      expect(getByTestId('OpenAppsIntentRoutes')).toBeInTheDocument()
      expect(queryByTestId('AppInstallation')).toBeNull()
      expect(queryByTestId('InstallSuccess')).toBeNull()
    })
  })
})
