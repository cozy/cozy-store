import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppVote from 'ducks/components/AppVote'
import AppsLoading from 'ducks/components/AppsLoading'
import {
  mkHomeMagicFolderConn,
  mkHomeCustomShorcutsDirConn,
  mkHomeCustomShorcutsConn
} from 'ducks/queries'
import { useNavigateNoUpdates, withRouterUtils } from 'lib/RouterUtils'
import PropTypes from 'prop-types'
import React, { Component, useEffect } from 'react'
import { useMatch, useSearchParams } from 'react-router-dom'

import { BarCenter } from 'cozy-bar'
import { useQuery } from 'cozy-client'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

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
      onTerminate
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
  const { t } = useI18n()

  // Temp code to test the queries
  const homeMagicFolderConn = mkHomeMagicFolderConn(t)
  const magicHomeFolder = useQuery(
    homeMagicFolderConn.definition,
    homeMagicFolderConn.options
  )
  const magicHomeFolderId = magicHomeFolder?.data?.[0]?._id

  const homeCustomShorcutsDirConn = mkHomeCustomShorcutsDirConn({
    currentFolderId: magicHomeFolderId
  })
  const customShortcutsDir = useQuery(
    homeCustomShorcutsDirConn.definition,
    homeCustomShorcutsDirConn.options
  )
  const dirIds = customShortcutsDir.data?.map(folder => folder._id)

  const homeCustomShorcutsConn = mkHomeCustomShorcutsConn(dirIds)
  const customShortcuts = useQuery(homeCustomShorcutsConn.definition, {
    ...homeCustomShorcutsConn.options,
    enabled: Boolean(dirIds && dirIds.length > 0)
  })

  useEffect(() => {
    console.log('magicHomeFolder', magicHomeFolder)
    console.log('customShortcutsDir', customShortcutsDir)
    console.log('customShortcuts', customShortcuts)
  }, [customShortcutsDir, customShortcuts, magicHomeFolder])

  return (
    <Discover
      {...props}
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
