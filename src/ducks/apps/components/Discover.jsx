/* global cozy */
import React, { Component } from 'react'
import { useMatch, useSearchParams } from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { Content } from 'cozy-ui/transpiled/react/Layout'

import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppsLoading from 'ducks/components/AppsLoading'
import AppVote from 'ducks/components/AppVote'

import { useNavigateNoUpdates, withRouterUtils } from 'lib/RouterUtils'

const { BarCenter } = cozy.bar

export class Discover extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
  }

  onAppClick(appSlug) {
    const { navigate, searchParams } = this.props

    if (searchParams) {
      const redirectRawPath = searchParams.get('redirectAfterInstall')

      if (redirectRawPath) {
        const redirectURL = new URL(redirectRawPath)
        redirectURL.hash += `?connectorSlug=${appSlug}`
        const encodedRedirectPath = encodeURIComponent(redirectURL.href)

        return navigate(
          `/discover/${appSlug}?redirectAfterInstall=${encodedRedirectPath}`
        )
      }
    }

    navigate(`/discover/${appSlug}`)
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
                parent="discover"
              />
            )}
          </div>
          {!isFetching && <AppVote />}
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
  const [searchParams] = useSearchParams()

  return (
    <Discover
      {...props}
      isExact={isExact}
      navigate={navigate}
      searchParams={searchParams}
    />
  )
}

export default translate()(withBreakpoints()(withRouterUtils(DiscoverWrapper)))
