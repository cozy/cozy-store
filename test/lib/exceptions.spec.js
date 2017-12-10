'use strict'

/* eslint-env jest */

import * as exceptions from '../../src/lib/exceptions'

const exceptionProperties = [
  'ForbiddenException',
  'ServerErrorException',
  'NotFoundException',
  'MethodNotAllowedException',
  'UnavailableStackException',
  'UnavailableRegistryException',
  'UnavailableSettingsException',
  'UnauthorizedStackException',
  'NotUninstallableAppException'
]

const statusCodes = ['401', '403', '404', '405', '500']

describe('Exceptions library', () => {
  it('should have correct exeception classes', () => {
    exceptionProperties.map(p => {
      expect(exceptions).toHaveProperty(p)
      const testInstance = new exceptions[p]()
      expect(testInstance).toHaveProperty('name')
      expect(testInstance).toHaveProperty('message')
      expect(testInstance).toHaveProperty('stack')
    })
  })
  it('should have correct error statuses properties', () => {
    expect(exceptions).toHaveProperty('errorStatuses')
    statusCodes.map(s => {
      expect(exceptions.errorStatuses).toHaveProperty(s)
    })
  })
})
