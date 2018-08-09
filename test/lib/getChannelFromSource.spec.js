'use strict'

/* eslint-env jest */

import getChannelFromSource from 'lib/getChannelFromSource'
import { REGISTRY_CHANNELS } from 'ducks/apps'

describe('getChannelFromSource library', () => {
  it('should find all registry channels correctly', () => {
    for (let channel in REGISTRY_CHANNELS) {
      expect(
        getChannelFromSource(`registry://mockApp/${REGISTRY_CHANNELS[channel]}`)
      ).toBe(REGISTRY_CHANNELS[channel])
    }
  })

  it('should return null if channel not found', () => {
    expect(getChannelFromSource(`registry://mockApp/blablabla`)).toBe(null)
  })

  it('should return null if wrong source format', () => {
    expect(getChannelFromSource(`registry://blablabla`)).toBe(null)
  })
})
