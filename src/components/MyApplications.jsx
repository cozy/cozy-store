import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import SmallAppItem from './SmallAppItem'
import ApplicationModal from './ApplicationModal'

class MyApplications extends Component {
  constructor (props) {
    super(props)
    props.fetchApps()
  }

  onAppClick (appSlug) {
    this.props.history.push(`/myapps/${appSlug}/manage`)
  }

  render () {
    const { t, myApps, isFetching, error } = this.props
    return (
      <div className='sto-myapps'>
        <h2 className='sto-myapps-title'>{t('myapps.title')}</h2>
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
                onClick={() => this.onAppClick(a.slug)}
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

        <Route path='/myapps/:appSlug/manage' render={({ match }) =>
          (<ApplicationModal {...this.props} match={match} />)
        } />
      </div>
    )
  }
}

export default translate()(MyApplications)
