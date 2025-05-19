'use strict'

import { getCurrentStatusLabel } from '@/ducks/apps/appStatus'

describe('getCurrentStatusLabel()', () => {
  it('should return "update" if pending update', () => {
    expect(getCurrentStatusLabel({ availableVersion: '1.0.1' })).toBe('update')
  })

  it('should return "update" if pending update even if under maintenance', () => {
    expect(
      getCurrentStatusLabel({ availableVersion: '1.0.1', maintenance: true })
    ).toBe('update')
  })

  it('should return "maintenance" the app is under maintenance but not pending update', () => {
    expect(getCurrentStatusLabel({ maintenance: true })).toBe('maintenance')
  })

  it('should return "installed" if installed but no pending update and no maintenance', () => {
    expect(getCurrentStatusLabel({ installed: true })).toBe('installed')
  })

  it('should return null if not installed', () => {
    expect(getCurrentStatusLabel({ slug: 'collect' })).toBe(null)
  })
})
