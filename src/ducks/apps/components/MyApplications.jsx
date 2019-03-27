/* global cozy */
import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { Content } from 'cozy-ui/react/Layout'

import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/Sections'
import AppsLoading from 'ducks/components/AppsLoading'

import getFilteredAppsFromSearch from 'lib/getFilteredAppsFromSearch'

const { BarCenter } = cozy.bar

export class MyApplications extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
    this.pushQuery = this.pushQuery.bind(this)
  }

  onAppClick(appSlug) {
    this.props.history.push(`/myapps/${appSlug}`)
  }

  pushQuery(query) {
    if (!query) return this.props.history.push('/myapps')
    this.props.history.push(`/myapps?${query}`)
  }

  render() {
    const {
      t,
      location,
      installedApps,
      isFetching,
      isAppFetching,
      fetchError,
      actionError,
      breakpoints = {},
      match
    } = this.props
    const { isExact } = match
    const { isMobile } = breakpoints
    const query = !!location && location.search
    const filteredApps = getFilteredAppsFromSearch(installedApps, query)
    const title = <h2 className="sto-view-title">{t('myapps.title')}</h2>
    return (
      <Content className="sto-myapps">
        {isExact && isFetching && <AppsLoading />}
        <div className="sto-list-container">
          {isMobile && <BarCenter>{title}</BarCenter>}
          <div className="sto-myapps-sections">
            {!isFetching && (
              <Sections
                apps={filteredApps}
                allApps={installedApps}
                error={fetchError}
                onAppClick={this.onAppClick}
                pushQuery={this.pushQuery}
                query={query}
              />
            )}
          </div>
        </div>

        <ApplicationRouting
          installedApps={filteredApps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          actionError={actionError}
          parent="myapps"
        />
      </Content>
    )
  }
}

export default translate()(withBreakpoints()(MyApplications))
