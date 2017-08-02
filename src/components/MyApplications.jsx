import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import SmallAppItem from './SmallAppItem'

class MyApplications extends Component {
  constructor (props) {
    super(props)
    props.fetchApps()
  }

  render () {
    const { t, myApps, isFetching, error } = this.props
    return (
      <div className='sto-myapps'>
        <h2 className='sto-content-title'>{t('myapps.title')}</h2>
        <div className='sto-myapps-list'>
          {!isFetching && myApps && !!myApps.length &&
            myApps.map(a => {
              return <SmallAppItem
                slug={a.slug}
                developer={a.developer}
                editor={a.editor}
                icon={a.icon}
                name={a.name}
                version={a.version}
              />
            })
          }
          {error &&
            <p>{error}</p>
          }
        </div>
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

export default translate()(MyApplications)
