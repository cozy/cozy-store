import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

import AppsSection from './AppsSection'
import { APP_TYPE } from '../index'

const _getSortedByCategories = appsList => {
  return appsList.reduce((sortedAppsObject, app) => {
    app.categories.map(c => {
      if (!sortedAppsObject.hasOwnProperty(c)) sortedAppsObject[c] = []
      sortedAppsObject[c].push(app)
    })
    return sortedAppsObject
  }, {})
}

// alphabetically except for 'others' always at the end
const _sortAlphabetically = (list, t) => {
  return list.sort((a, b) => {
    return (
      (a === 'others' && 1) ||
      (b === 'others' && -1) ||
      t(`app_categories.${a}`) > t(`app_categories.${b}`)
    )
  })
}

export const Sections = ({ t, apps, error, onAppClick }) => {
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
  return (
    <div className="sto-sections">
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

export default translate()(Sections)
