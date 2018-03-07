import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

import AppsSection from './AppsSection'
import { APP_TYPE } from '../index'

const _getSortedByCategories = (appsList) => {
  return appsList.reduce((sortedAppsObject, app) => {
    app.categories.map(c => {
      if (!sortedAppsObject.hasOwnProperty(c)) sortedAppsObject[c] = []
      sortedAppsObject[c].push(app)
    })
    return sortedAppsObject
  }, {})
}

export const Sections = ({t, lang, apps, error, onAppClick}) => {
  if (error) return <p className='u-error'>{error.message}</p>
  const konnectorsCategories = _getSortedByCategories(
    apps.filter(a => a.type === APP_TYPE.KONNECTOR)
  )
  const webAppsCategories = _getSortedByCategories(
    apps.filter(a => a.type === APP_TYPE.WEBAPP)
  )
  return (<div className='sto-sections'>
    {!!Object.keys(webAppsCategories).length &&
      <div className='sto-sections-section'>
        <h2 className='sto-sections-title'>
          {t('sections.applications')}
        </h2>
        {Object.keys(webAppsCategories).map(cat => {
          return (
            <AppsSection
              appsList={webAppsCategories[cat]}
              subtitle={t(`app_categories.${cat}`)}
              onAppClick={onAppClick}
            />
          )
        })}
      </div>
    }
    {!!Object.keys(konnectorsCategories).length &&
      <div className='sto-sections-section'>
        <h2 className='sto-sections-title'>
          {t('sections.konnectors')}
        </h2>
        {Object.keys(konnectorsCategories).map(cat => {
          return (
            <AppsSection
              appsList={konnectorsCategories[cat]}
              subtitle={t(`app_categories.${cat}`)}
              onAppClick={onAppClick}
            />
          )
        })}
      </div>
    }
  </div>)
}

export default translate()(Sections)
