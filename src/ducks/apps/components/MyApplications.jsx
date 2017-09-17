import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import SmallAppItem from '../../components/SmallAppItem'
import UninstallModal from './UninstallModal'

export class MyApplications extends Component {
  constructor (props) {
    super(props)
    props.fetchInstalledApps()
  }

  onAppClick (appSlug) {
    this.props.history.push(`/myapps/${appSlug}/manage`)
  }

  render () {
    const { t, installedApps, isFetching, fetchError } = this.props
    return (
      <div className='sto-myapps'>
        <h2 className='sto-myapps-title'>{t('myapps.title')}</h2>
        <div className='sto-myapps-list'>
          {!isFetching && installedApps && !!installedApps.length &&
            installedApps.map(app => {
              return <SmallAppItem
                slug={app.slug}
                developer={app.developer}
                editor={app.editor}
                icon={app.icon}
                name={app.name}
                version={app.version}
                installed={app.installed}
                onClick={() => this.onAppClick(app.slug)}
                key={app.slug}
              />
            })
          }
          {fetchError &&
            <p>{fetchError.message}</p>
          }
        </div>
        {isFetching &&
          <Spinner
            size='xxlarge'
            loadingType='appsFetching'
            middle='true'
          />
        }

        <Route path='/myapps/:appSlug/manage' render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            return <UninstallModal uninstallApp={this.props.uninstallApp} parent='/myapps' error={this.props.actionError} app={app} match={match} />
          }
        }} />
      </div>
    )
  }
}

export default translate()(MyApplications)
