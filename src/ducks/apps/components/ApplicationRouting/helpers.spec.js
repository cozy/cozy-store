import { isFlagshipApp } from 'cozy-device-helper'

import { redirectToConfigure } from './helpers'

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isFlagshipApp: jest.fn()
}))

describe('redirectToConfigure', () => {
  const parent = 'Parent'

  describe('when intentData is undefined (out of intent)', () => {
    const intentData = undefined
    const mockCompose = undefined
    const mockOnTerminate = undefined

    it('should redirect to the correct path if "isFlagshipApp" is truthy', () => {
      isFlagshipApp.mockReturnValue(true)
      const mockRedirectTo = jest.fn()
      const app = { slug: 'app-slug' }

      redirectToConfigure({
        intentData,
        compose: mockCompose,
        app,
        parent,
        redirectTo: mockRedirectTo,
        onTerminate: mockOnTerminate
      })

      expect(mockRedirectTo).toHaveBeenCalledWith('/Parent/app-slug')
    })

    it('should redirect to the correct path if "isFlagshipApp" is falsy', () => {
      isFlagshipApp.mockReturnValue(false)
      const mockRedirectTo = jest.fn()
      const app = { slug: 'app-slug' }

      redirectToConfigure({
        intentData,
        compose: mockCompose,
        app,
        parent,
        redirectTo: mockRedirectTo,
        onTerminate: mockOnTerminate
      })

      expect(mockRedirectTo).toHaveBeenCalledWith('/Parent/app-slug/configure')
    })
  })

  describe('when intentData is defined (in intent)', () => {
    const mockRedirectTo = jest.fn()

    it('should call to the correct function if "data.configure" is truthy (undefined is considered true)', () => {
      const intentData = { data: { configure: undefined } }
      const mockCompose = jest.fn()
      const mockOnTerminate = jest.fn()
      const app = { slug: 'app-slug' }
      redirectToConfigure({
        intentData,
        compose: mockCompose,
        app,
        parent,
        redirectTo: mockRedirectTo,
        onTerminate: mockOnTerminate
      })

      expect(mockCompose).toHaveBeenCalledWith('CREATE', 'io.cozy.accounts', {
        slug: 'app-slug'
      })
      expect(mockOnTerminate).not.toHaveBeenCalled()
      expect(mockRedirectTo).not.toHaveBeenCalled()
    })

    it('should call to the correct function if "data.configure" is false', () => {
      const intentData = { data: { configure: false } }
      const mockCompose = jest.fn()
      const mockOnTerminate = jest.fn()
      const app = { slug: 'app-slug' }
      redirectToConfigure({
        intentData,
        compose: mockCompose,
        app,
        parent,
        redirectTo: mockRedirectTo,
        onTerminate: mockOnTerminate
      })

      expect(mockOnTerminate).toHaveBeenCalledWith({ slug: 'app-slug' })
      expect(mockCompose).not.toHaveBeenCalled()
      expect(mockRedirectTo).not.toHaveBeenCalled()
    })
  })
})
