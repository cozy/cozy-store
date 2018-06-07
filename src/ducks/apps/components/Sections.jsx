import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import AppsSection from './AppsSection'
import DropdownFilter from './DropdownFilter'
import { APP_TYPE } from '../index'

const SPECIAL_SELECT_OPTIONS = ['all', 'webapps', 'konnectors']

const _getSortedByCategories = appsList => {
  return appsList.reduce((sortedAppsObject, app) => {
    app.categories.map(c => {
      if (!sortedAppsObject.hasOwnProperty(c)) sortedAppsObject[c] = []
      sortedAppsObject[c].push(app)
    })
    return sortedAppsObject
  }, {})
}

// alphabetically except for 'others' always at the end and
// 'all' always at the beginning
const _sortAlphabetically = (list, t) => {
  return list.sort((a, b) => {
    return (
      (a === 'others' && 1) ||
      (b === 'others' && -1) ||
      (a === 'all' && -1) ||
      (b === 'all' && 1) ||
      t(`app_categories.${a}`) > t(`app_categories.${b}`)
    )
  })
}

export class Sections extends Component {
  render() {
    const { t, apps, error, onAppClick, allApps, query, pushQuery } = this.props
    if (error) return <p className="u-error">{error.message}</p>
    const konnectorsList = _getSortedByCategories(
      apps.filter(a => a.type === APP_TYPE.KONNECTOR)
    )
    const konnectorsCategories = _sortAlphabetically(
      Object.keys(konnectorsList),
      t
    )
    const webAppsList = _getSortedByCategories(
      apps.filter(a => a.type === APP_TYPE.WEBAPP)
    )
    const webAppsCategories = _sortAlphabetically(Object.keys(webAppsList), t)

    const allCategories = _sortAlphabetically(
      Object.keys(_getSortedByCategories(allApps)),
      t
    )

    const selectOptions = _sortAlphabetically(
      [
        // merge and remove duplicates
        ...new Set([...SPECIAL_SELECT_OPTIONS, ...allCategories])
      ],
      t
    ).map(cat => ({
      value: cat,
      fixed: SPECIAL_SELECT_OPTIONS.includes(cat) ? true : false,
      label: t(`app_categories.${cat}`)
    }))
    return (
      <div className="sto-sections">
        <DropdownFilter
          options={selectOptions}
          query={query}
          pushQuery={pushQuery}
        />
        {!!webAppsCategories.length && (
          <div className="sto-sections-section">
            <h2 className="sto-sections-title">{t('sections.applications')}</h2>
            {webAppsCategories.map(cat => {
              return (
                <AppsSection
                  key={cat}
                  appsList={webAppsList[cat]}
                  subtitle={t(`app_categories.${cat}`)}
                  onAppClick={onAppClick}
                />
              )
            })}
          </div>
        )}
        {!!konnectorsCategories.length && (
          <div className="sto-sections-section">
            <h2 className="sto-sections-title">{t('sections.konnectors')}</h2>
            {konnectorsCategories.map(cat => {
              return (
                <AppsSection
                  key={cat}
                  appsList={konnectorsList[cat]}
                  subtitle={t(`app_categories.${cat}`)}
                  onAppClick={onAppClick}
                />
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

export default translate()(Sections)
