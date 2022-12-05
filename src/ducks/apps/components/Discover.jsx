/* global cozy */
import React, { Component } from 'react'
import { useMatch } from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { Content } from 'cozy-ui/transpiled/react/Layout'

import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppsLoading from 'ducks/components/AppsLoading'
//import AppVote from 'ducks/components/AppVote'

import { useNavigateNoUpdates, withRouterUtils } from 'lib/RouterUtils'

const { BarCenter } = cozy.bar

export class Discover extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
    this.pushQuery = this.pushQuery.bind(this)
  }

  onAppClick(appSlug) {
    this.props.navigate(`/discover/${appSlug}`)
  }

  pushQuery(query) {
    if (!query) return this.props.navigate('/discover')
    this.props.navigate(`/discover?${query}`)
  }

  render() {
    const {
      t,
      apps,
      isFetching,
      isAppFetching,
      fetchError,
      isUninstalling,
      actionError,
      breakpoints = {},
      isExact
    } = this.props

    const { isMobile } = breakpoints
    const title = <h2 className="sto-view-title">{t('discover.title')}</h2>
    return (
      <Content className="sto-discover">
        {isExact && isFetching && <AppsLoading />}
        <div className="sto-list-container">
          {isMobile && <BarCenter>{title}</BarCenter>}
          <div className="sto-discover-sections">
            {!isFetching && (
              <Sections
                apps={apps}
                error={fetchError}
                onAppClick={this.onAppClick}
              />
            )}
          </div>
          {
            /**
             * We have disabled this AppVote component since
             * we have issue with our framaform. We're trying
             * to find a new solution, so in the mean time
             * let's remove it
             */
            //!isFetching && <AppVote />
          }
        </div>

        <ApplicationRouting
          apps={apps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          isUninstalling={isUninstalling}
          actionError={actionError}
          parent="discover"
        />
      </Content>
    )
  }
}

const DiscoverWrapper = props => {
  const isExact = useMatch('discover')
  const navigate = useNavigateNoUpdates()

  return <Discover {...props} isExact={isExact} navigate={navigate} />
}

export default translate()(withBreakpoints()(withRouterUtils(DiscoverWrapper)))
