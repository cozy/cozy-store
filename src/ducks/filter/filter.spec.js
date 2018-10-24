/* eslint-env jest */

import { filterApps } from 'ducks/filter'

describe('filter', () => {
  const driveApp = {
    categories: ['cozy'],
    permissions: [
      {
        description: 'Required for test',
        type: 'io.cozy.files'
      }
    ],
    type: 'webapp',
    slug: 'drive'
  }

  const photosApp = {
    categories: ['cozy'],
    permissions: [
      {
        description: 'Required for test',
        type: 'io.cozy.files'
      }
    ],
    type: 'webapp',
    slug: 'photos'
  }

  const transportsApp = {
    categories: ['transport'],
    permissions: [
      {
        description: 'Required for test',
        type: 'io.cozy.bills'
      }
    ],
    type: 'webapp',
    slug: 'transports'
  }

  const trainKonnector = {
    categories: ['transport'],
    permissions: [
      {
        description: 'Required for test',
        type: 'io.cozy.bills'
      }
    ],
    type: 'konnector',
    slug: 'train'
  }

  const phoneKonnector = {
    categories: ['telecom'],
    permissions: [
      {
        description: 'Required for test',
        type: 'io.cozy.bills'
      }
    ],
    type: 'konnector',
    slug: 'phone'
  }

  const apps = [
    driveApp,
    phoneKonnector,
    photosApp,
    trainKonnector,
    transportsApp
  ]

  it('returns unfiltered array when no filter', () => {
    expect(filterApps(undefined, apps).map(app => app.slug)).toEqual([
      driveApp.slug,
      phoneKonnector.slug,
      photosApp.slug,
      trainKonnector.slug,
      transportsApp.slug
    ])
  })

  it('returs unfiltered array when empty filter', () => {
    expect(filterApps({}, apps).map(app => app.slug)).toEqual([
      driveApp.slug,
      phoneKonnector.slug,
      photosApp.slug,
      trainKonnector.slug,
      transportsApp.slug
    ])
  })

  it('filter apps on attribute (type)', () => {
    expect(
      filterApps(
        {
          type: 'webapp'
        },
        apps
      ).map(app => app.slug)
    ).toEqual([driveApp.slug, photosApp.slug, transportsApp.slug])
  })

  it('filter apps on array attribute (category)', () => {
    expect(
      filterApps(
        {
          category: 'transport'
        },
        apps
      ).map(app => app.slug)
    ).toEqual([trainKonnector.slug, transportsApp.slug])
  })

  it('filter apps on doctype', () => {
    expect(
      filterApps(
        {
          doctype: 'io.cozy.bills'
        },
        apps
      ).map(app => app.slug)
    ).toEqual([phoneKonnector.slug, trainKonnector.slug, transportsApp.slug])
  })

  it('filter apps on multiple criteria', () => {
    expect(
      filterApps(
        {
          category: 'transport',
          type: 'konnector'
        },
        apps
      ).map(app => app.slug)
    ).toEqual([trainKonnector.slug])
  })

  it("don't fail with empty app list", () => {
    expect(
      filterApps(
        {
          category: 'transport',
          type: 'konnector'
        },
        []
      ).map(app => app.slug)
    ).toEqual([])
  })
})
