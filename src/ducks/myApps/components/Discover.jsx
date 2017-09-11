import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import SmallAppItem from '../../components/SmallAppItem'

export class Discover extends Component {
  constructor (props) {
    super(props)
    props.fetchApps()
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
              const version = a.version || (a.versions && a.versions.stable && a.versions.stable[a.versions.stable.length - 1]) || ''
              return <SmallAppItem
                slug={a.slug}
                developer={a.developer || ''}
                editor={a.editor || ''}
                icon={a.icon}
                name={a.name}
                version={version}
                installed={a.installed}
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
      </div>
    )
  }
}

export default translate()(Discover)
