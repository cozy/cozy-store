import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import ApplicationRouting from './ApplicationRouting'
import SmallAppItem from '../../components/SmallAppItem'

import { getLocalizedAppProperty } from 'ducks/apps'

export class MyApplications extends Component {
  constructor (props) {
    super(props)
    props.fetchInstalledApps()
  }

  onAppClick (appSlug) {
    this.props.history.push(`/myapps/${appSlug}`)
  }

  render () {
    const { t, lang, installedApps, isFetching, fetchError, actionError } = this.props
    return (
      <div className='sto-myapps'>
        {this.props.match.isExact ? (
          <div>
            <h2 className='sto-myapps-title'>{t('myapps.title')}</h2>
            <div className='sto-myapps-list'>
              {!isFetching &&
                installedApps &&
                !!installedApps.length &&
                installedApps.map(app => {
                  const appName = getLocalizedAppProperty(app, 'name', lang)
                  const appNamePrefix = getLocalizedAppProperty(app, 'name_prefix', lang)
                  return (
                    <SmallAppItem
                      slug={app.slug}
                      developer={app.developer}
                      namePrefix={appNamePrefix || ''}
                      editor={app.editor}
                      icon={app.icon}
                      name={appName}
                      installed={app.installed}
                      onClick={() => this.onAppClick(app.slug)}
                      key={app.slug}
                    />
                  )
                })}
              {fetchError && <p className='u-error'>{fetchError.message}</p>}
            </div>
          </div>
        ) : null}

        <ApplicationRouting
          installedApps={installedApps}
          isFetching={isFetching}
          actionError={actionError}
          installApp={this.props.installApp}
          uninstallApp={this.props.uninstallApp}
          parent='myapps'
        />

        {isFetching && (
          <Spinner size='xxlarge' loadingType='appsFetching' middle='true' />
        )}
      </div>
    )
  }
}

export default translate()(MyApplications)
