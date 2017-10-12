import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import SmallAppItem from '../../components/SmallAppItem'

import ApplicationRouting from './ApplicationRouting'

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
    const { t, lang, apps, isFetching, fetchError, isInstalling } = this.props
    return (
      <div className='sto-discover'>
        {
          this.props.match.isExact
          ? <div>
            <h2 className='sto-discover-title'>{t('discover.title')}</h2>
            <div className='sto-discover-get-started'>
              <h3 className='sto-discover-get-started-title'>
                {t('discover.get_started')}
              </h3>
              <div className='sto-discover-get-started-list'>
                {!isFetching && apps.map(app => {
                  const stableVers = app.versions.stable
                  const version = stableVers[stableVers.length - 1]
                  const appName = app.name && (app.name[lang] || app.name.en)
                  return <SmallAppItem
                    slug={app.slug}
                    developer={app.developer || ''}
                    editor={app.editor || ''}
                    icon={app.icon}
                    name={appName}
                    version={version}
                    installed={app.installed}
                    onClick={() => this.onAppClick(app.slug)}
                    key={app.slug}
                  />
                })}
                {fetchError &&
                  <p className='coz-error'>{fetchError.message}</p>
                }
              </div>
            </div>
          </div>
          : null
        }

        <ApplicationRouting
          apps={apps}
          isFetching={isFetching}
          isInstalling={isInstalling}
          installApp={this.props.installApp}
          uninstallApp={this.props.uninstallApp}
          parent='discover'
        />

        {isFetching &&
          <Spinner
            size='xxlarge'
            loadingType='appsFetching'
            middle='true'
          />
        }
      </div>
    )
  }
}

export default translate()(Discover)
