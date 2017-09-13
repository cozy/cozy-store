import React, { Component } from 'react'

import { Route } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import SmallAppItem from '../../components/SmallAppItem'
import UninstallModal from './UninstallModal'
import { InstallModal } from '../currentAppVersion/Containers'

export class Discover extends Component {
  constructor (props, context) {
    super(props)
    props.fetchApps(context.lang)

    this.onAppClick = this.onAppClick.bind(this)
  }

  onAppClick (appSlug) {
    this.props.history.push(`/discover/${appSlug}/manage`)
  }

  render () {
    const { t, apps, isFetching } = this.props
    return (
      <div className='sto-discover'>
        <h2 className='sto-discover-title'>{t('discover.title')}</h2>
        <div className='sto-discover-get-started'>
          <h3 className='sto-discover-get-started-title'>
            {t('discover.get_started')}
          </h3>
          <div className='sto-discover-get-started-list'>
            {!isFetching && apps.map(a => {
              // don't display app installed but not in registry
              if (!a.isInRegistry) return null
              let version = a.version
              if (a.versions && Array.isArray(a.versions.stable)) {
                version = (a.versions.stable && a.versions.stable[a.versions.stable.length - 1])
              }
              return <SmallAppItem
                slug={a.slug}
                developer={a.developer || ''}
                editor={a.editor || ''}
                icon={a.icon}
                name={a.name}
                version={version}
                installed={a.installed}
                onClick={() => this.onAppClick(a.slug)}
              />
            })}
            {isFetching &&
              <Spinner
                size='xxlarge'
                loadingType='appsFetching'
                middle='true'
              />
            }
          </div>
        </div>
        <Route path='/discover/:appSlug/manage' render={({ match }) => {
          if (isFetching) return
          if (apps.length && match.params) {
            const app = apps.find(app => app.slug === match.params.appSlug)
            if (app.installed) {
              return <UninstallModal uninstallApp={this.props.uninstallApp} parent='/discover' app={app} match={match} />
            } else if (!app.installed) {
              return <InstallModal installApp={this.props.installApp} currentAppVersion={this.props.currentAppVersion} parent='/discover' app={app} match={match} />
            }
          }
        }} />
      </div>
    )
  }
}

export default translate()(Discover)
