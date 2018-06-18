/* global cozy */
import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

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
      breakpoints = {}
    } = this.props
    const { isMobile } = breakpoints
    const query = !!location && location.search
    const filteredApps = getFilteredAppsFromSearch(apps, query)
    const title = <h2 className="sto-view-title">{t('discover.title')}</h2>
    return (
      <div className="sto-discover">
        {this.props.match.isExact ? (
          <div>
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
        ) : null}

        <ApplicationRouting
          apps={filteredApps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          isInstalling={isInstalling}
          isUninstalling={isUninstalling}
          actionError={actionError}
          installApp={this.props.installApp}
          uninstallApp={this.props.uninstallApp}
          updateApp={this.props.updateApp}
          fetchLatestApp={this.props.fetchLatestApp}
          parent="discover"
        />

        {isFetching && <AppsLoading />}
      </div>
    )
  }
}

export default translate()(withBreakpoints()(Discover))
