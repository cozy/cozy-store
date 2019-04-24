'use strict'

/* eslint-env jest */

import isNavigationEnabled from 'lib/isNavigationEnabled'

describe('isNavigationEnabled library', () => {
  it('should return true if no flag `nav` provided', () => {
    expect(isNavigationEnabled('')).toBe(true)
  })

  it('should return false if flag `nav=false` provided', () => {
    expect(isNavigationEnabled('?nav=false')).toBe(false)
  })

  it('should return true if any other flag `nav` value provided', () => {
    expect(isNavigationEnabled('?nav=blabla')).toBe(true)
  })

  it('should return true if no search provided', () => {
    expect(isNavigationEnabled()).toBe(true)
  })
})
