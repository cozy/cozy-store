import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppVote from 'ducks/components/AppVote'
import AppsLoading from 'ducks/components/AppsLoading'
import { useNavigateNoUpdates, withRouterUtils } from 'lib/RouterUtils'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useMatch, useSearchParams } from 'react-router-dom'

import { BarCenter } from 'cozy-bar'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import { useAlternativeStore } from 'ducks/AlternativeStore/useAlternativeStore'

export class Discover extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
  }

  onAppClick(appSlug) {
    const { navigate, searchParams } = this.props
    const search = searchParams.size > 0 ? `?${searchParams.toString()}` : ''
    navigate(`/discover/${appSlug}${search}`)
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
      isExact,
      intentData,
      onTerminate,
      alternativeStore
    } = this.props

    const { isMobile } = breakpoints
    const title = <h2 className="sto-view-title">{t('discover.title')}</h2>
    return (
      <Content className="sto-discover">
        {isExact && isFetching && <AppsLoading />}
        <div className="sto-list-container">
          {isMobile && !intentData && <BarCenter>{title}</BarCenter>}
          <div className="sto-discover-sections">
            {!isFetching && (
              <Sections
                apps={apps}
                error={fetchError}
                onAppClick={this.onAppClick}
                intentData={intentData}
                parent="discover"
                alternativeStore={alternativeStore}
              />
            )}
          </div>
          {!isFetching && !intentData && <AppVote />}
        </div>

        <ApplicationRouting
          apps={apps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          isUninstalling={isUninstalling}
          actionError={actionError}
          intentData={intentData}
          onTerminate={onTerminate}
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
  const { alternativeApps } = useAlternativeStore()

  return (
    <Discover
      {...props}
      apps={[...alternativeApps, ...props.apps]}
      isExact={isExact}
      navigate={navigate}
      searchParams={searchParams}
    />
  )
}

DiscoverWrapper.propTypes = {
  apps: PropTypes.array,
  isFetching: PropTypes.bool.isRequired,
  isAppFetching: PropTypes.bool.isRequired,
  isUninstalling: PropTypes.bool.isRequired,
  fetchError: PropTypes.object,
  actionError: PropTypes.object,
  intentData: PropTypes.shape({
    appData: PropTypes.object,
    data: PropTypes.object
  }),
  onTerminate: PropTypes.func,
  /* With HOC */
  breakpoints: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(withBreakpoints()(withRouterUtils(DiscoverWrapper)))
