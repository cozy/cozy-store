/* global cozy */
import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { Content } from 'cozy-ui/react/Layout'

import ApplicationRouting from './ApplicationRouting'
import Sections from './Sections'
import AppsLoading from 'ducks/components/AppsLoading'
import AppVote from 'ducks/components/AppVote'

import getFilteredAppsFromSearch from 'lib/getFilteredAppsFromSearch'

const { BarCenter } = cozy.bar

export class Discover extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
    this.pushQuery = this.pushQuery.bind(this)
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
      location,
      apps,
      isFetching,
      isAppFetching,
      fetchError,
      isInstalling,
      isUninstalling,
      actionError,
      breakpoints = {},
      match
    } = this.props
    const { isExact } = match
    const { isMobile } = breakpoints
    const query = !!location && location.search
    const filteredApps = getFilteredAppsFromSearch(apps, query)
    const title = <h2 className="sto-view-title">{t('discover.title')}</h2>
    return (
      <Content className="sto-discover">
        {isExact && isFetching && <AppsLoading />}
        <div className="sto-list-container">
          {isMobile && <BarCenter>{title}</BarCenter>}
          <div className="sto-discover-sections">
            {!isFetching && (
              <Sections
                apps={filteredApps}
                allApps={apps}
                error={fetchError}
                onAppClick={this.onAppClick}
                pushQuery={this.pushQuery}
                query={query}
              />
            )}
          </div>
          {!isFetching && <AppVote />}
        </div>

        <ApplicationRouting
          apps={filteredApps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          isInstalling={isInstalling}
          isUninstalling={isUninstalling}
          actionError={actionError}
          parent="discover"
        />
      </Content>
    )
  }
}

export default translate()(withBreakpoints()(Discover))
