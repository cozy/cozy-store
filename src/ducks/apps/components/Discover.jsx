/* global cozy */
import React, { Component } from 'react'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { Content } from 'cozy-ui/transpiled/react/Layout'

import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppsLoading from 'ducks/components/AppsLoading'
import get from 'lodash/get'
//import AppVote from 'ducks/components/AppVote'

const { BarCenter } = cozy.bar

export class Discover extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
    this.pushQuery = this.pushQuery.bind(this)

    const connectorOpenUri = new URLSearchParams(
      get(props.location, 'search')
    ).get('connector_open_uri')
    if (connectorOpenUri) {
      this.state = { connectorOpenUri }
    }
  }

  onAppClick(appSlug) {
    this.props.history.push(`/discover/${appSlug}`)
  }

  pushQuery(query) {
    if (!query) return this.props.history.push('/discover')
    this.props.history.push(`/discover?${query}`)
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
      match
    } = this.props

    const { isExact } = match
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
          connectorOpenUri={this.state.connectorOpenUri}
        />
      </Content>
    )
  }
}

export default translate()(withBreakpoints()(Discover))
