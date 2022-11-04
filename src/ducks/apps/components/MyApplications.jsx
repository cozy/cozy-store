/* global cozy */
import React, { Component } from 'react'
import { useMatch, useNavigate } from 'react-router'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { Content } from 'cozy-ui/transpiled/react/Layout'

import Sections from 'ducks/apps/components/QuerystringSections'
import AppsLoading from 'ducks/components/AppsLoading'

const { BarCenter } = cozy.bar

export class MyApplications extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
  }

  onAppClick(appSlug) {
    this.props.navigate(`/myapps/${appSlug}`)
  }

  render() {
    const {
      t,
      installedApps,
      isFetching,
      fetchError,
      breakpoints = {},
      isExact
    } = this.props

    const { isMobile } = breakpoints
    const title = <h2 className="sto-view-title">{t('myapps.title')}</h2>
    return (
      <Content className="sto-myapps">
        {isExact && isFetching && <AppsLoading />}
        <div className="sto-list-container">
          {isMobile && <BarCenter>{title}</BarCenter>}
          {!isFetching && (
            <Sections
              apps={installedApps}
              error={fetchError}
              onAppClick={this.onAppClick}
            />
          )}
        </div>
      </Content>
    )
  }
}

const MyApplicationsWrapper = props => {
  const isExact = useMatch('myapps')
  const navigate = useNavigate()

  return <MyApplications {...props} isExact={isExact} navigate={navigate} />
}

export default translate()(withBreakpoints()(MyApplicationsWrapper))
