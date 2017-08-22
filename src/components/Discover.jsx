import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'

import SmallAppItem from './SmallAppItem'

const DEMO_APPS = [
  {
    slug: 'bank',
    name: 'Bank',
    developer: {name: 'Cozy'},
    editor: 'Cozy',
    icon: require('../assets/temp_apps/icon-bank.svg')
  },
  {
    slug: 'sante',
    name: 'Santé',
    developer: {name: 'MAIF Ltd'},
    editor: '',
    icon: require('../assets/temp_apps/icon-sante.svg')
  },
  {
    slug: 'mon_logis',
    name: 'Mon Logis',
    developer: {name: 'HoodBrains'},
    editor: '',
    icon: require('../assets/temp_apps/icon-mon_logis.svg')
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    developer: {name: 'Cozy'},
    editor: 'Cozy',
    icon: require('../assets/temp_apps/icon-calendar.svg')
  }
]

class Discover extends Component {
  render () {
    const { t } = this.props
    return (
      <div className='sto-discover sto-soon'>
        <h2 className='sto-discover-title'>{t('discover.title')}</h2>
        <div className='sto-discover-get-started'>
          <h3 className='sto-discover-get-started-title'>
            {t('discover.get_started')}
          </h3>
          <div className='sto-discover-get-started-list'>
            {DEMO_APPS.map(a => {
              return <SmallAppItem
                slug={a.slug}
                developer={a.developer}
                editor={a.editor}
                icon={a.icon}
                name={a.name}
                version={a.version}
              />
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default translate()(Discover)
