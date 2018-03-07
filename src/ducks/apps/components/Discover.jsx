import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import ApplicationRouting from './ApplicationRouting'
import Sections from './Sections'

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
    const { t, apps, isFetching, fetchError, isInstalling, actionError } = this.props
    return (
      <div className='sto-discover'>
        {this.props.match.isExact ? (
          <div>
            <h2 className='sto-discover-title'>{t('discover.title')}</h2>
            <div className='sto-discover-sections'>
              {!isFetching &&
                <Sections
                  apps={apps}
                  error={fetchError}
                  onAppClick={this.onAppClick}
                />
              }
            </div>
          </div>
        ) : null}

        <ApplicationRouting
          apps={apps}
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
