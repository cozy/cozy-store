'use strict'

/* eslint-env jest */

import {
  getAppsSortedByCategories,
  getTranslatedManifestProperty,
  sortCategoriesAlphabetically,
  getCategoriesSelections
} from 'lib/helpers'

import { tMock } from '../jestLib/I18n'
import { extend as extendI18n } from 'cozy-ui/react/I18n'
import mockApps from '../ducks/apps/_mockApps'

describe('getAppsSortedByCategories helper', () => {
  it('should return apps sorted in a dictionnary by categories', () => {
    expect(getAppsSortedByCategories(mockApps)).toMatchSnapshot()
  })
})

describe('sortCategoriesAlphabetically helper', () => {
  it('should return a categories list alphabetically except for all and others', () => {
    const catList = ['cozy', 'all', 'isp', 'others', 'telecom']
    // get the localized list for the snapshot
    catList.forEach(cat => tMock(`app_categories.${cat}`))
    expect(sortCategoriesAlphabetically(catList, tMock)).toMatchSnapshot()

    // test with all and others at the border
    const catList2 = ['all', 'cozy', 'telecom', 'others']
    // get the localized list for the snapshot
    catList2.map(cat => tMock(`app_categories.${cat}`))
    expect(sortCategoriesAlphabetically(catList2, tMock)).toMatchSnapshot()
  })
})

describe('getCategoriesSelections helper', () => {
  it('should return a list of categories options for a select input based on the apps list', () => {
    expect(getCategoriesSelections(mockApps, tMock)).toMatchSnapshot()
  })

  it('should return include the all categories if includeAll option true', () => {
    expect(getCategoriesSelections(mockApps, tMock, true)).toMatchSnapshot()
  })

  it('should return an empty list if empty apps list provided', () => {
    expect(getCategoriesSelections([], tMock)).toMatchSnapshot()
  })

  it('should return an empty list if no apps provided', () => {
    expect(getCategoriesSelections(null, tMock)).toMatchSnapshot()
  })
})

describe('getTranslatedManifestProperty helper', () => {
  const appMock = {
    slug: 'mock',
    name: 'Not Translated Name',
    description: 'not translated description'
  }
  const translatedName = 'Translated Name'

  beforeAll(() => {
    extendI18n({
      [`apps.${appMock.slug}.name`]: translatedName
    })
  })

  it('should return the translated property if translated', () => {
    // name is translated here in the beforeAll
    expect(getTranslatedManifestProperty(appMock, 'name', tMock)).toBe(
      translatedName
    )
  })

  it('should fallback to the manifest property if no translated property found', () => {
    expect(getTranslatedManifestProperty(appMock, 'description', tMock)).toBe(
      appMock.description
    )
  })

  it('should always return an default empty string value', () => {
    expect(getTranslatedManifestProperty()).toBe('')
  })
})
