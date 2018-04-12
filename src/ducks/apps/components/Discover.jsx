import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import ApplicationRouting from './ApplicationRouting'
import Sections from './Sections'

import getFilteredAppsFromSearch from 'lib/getFilteredAppsFromSearch'

export class Discover extends Component {
  constructor (props, context) {
    super(props)
    props.fetchApps(context.lang)

    this.onAppClick = this.onAppClick.bind(this)
  }

  onAppClick (appSlug) {
    this.props.history.push(`/discover/${appSlug}`)
  }

  render () {
    const { t, location, apps, isFetching, fetchError, isInstalling, actionError } = this.props
    const filteredApps = getFilteredAppsFromSearch(apps, location && location.search)
    return (
      <div className='sto-discover'>
        {this.props.match.isExact ? (
          <div>
            <h2 className='sto-discover-title'>{t('discover.title')}</h2>
            <div className='sto-discover-sections'>
              {!isFetching &&
                <Sections
                  apps={filteredApps}
                  error={fetchError}
                  onAppClick={this.onAppClick}
                />
              }
            </div>
          </div>
        ) : null}

        <ApplicationRouting
          apps={filteredApps}
          isFetching={isFetching}
          isInstalling={isInstalling}
          actionError={actionError}
          installApp={this.props.installApp}
          uninstallApp={this.props.uninstallApp}
          parent='discover'
        />

        {isFetching && (
          <Spinner size='xxlarge' loadingType='appsFetching' middle='true' />
        )}
      </div>
    )
  }
}

export default translate()(Discover)
