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

export const Sections = ({ t, apps, error, onAppClick }) => {
  if (error) return <p className="u-error">{error.message}</p>
  const konnectorsCategories = _getSortedByCategories(
    apps.filter(a => a.type === APP_TYPE.KONNECTOR)
  )
  const categoriesList = Object.keys(konnectorsCategories).sort((a, b) => {
    // alphabetically except for 'others' always at the end
    return (a === 'others' && 1) || (b === 'others' && -1) || a > b
  })
  const webAppsCategories = _getSortedByCategories(
    apps.filter(a => a.type === APP_TYPE.WEBAPP)
  )
  return (
    <div className="sto-sections">
      {!!Object.keys(webAppsCategories).length && (
        <div className="sto-sections-section">
          <h2 className="sto-sections-title">{t('sections.applications')}</h2>
          {Object.keys(webAppsCategories).map(cat => {
            return (
              <AppsSection
                key={cat}
                appsList={webAppsCategories[cat]}
                subtitle={t(`app_categories.${cat}`)}
                onAppClick={onAppClick}
              />
            )
          })}
        </div>
      )}
      {!!categoriesList.length && (
        <div className="sto-sections-section">
          <h2 className="sto-sections-title">{t('sections.konnectors')}</h2>
          {categoriesList.map(cat => {
            return (
              <AppsSection
                key={cat}
                appsList={konnectorsCategories[cat]}
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
