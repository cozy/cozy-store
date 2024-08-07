import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppsLoading from 'ducks/components/AppsLoading'
import { useNavigateNoUpdates, withRouterUtils } from 'lib/RouterUtils'
import React, { Component } from 'react'
import { useMatch, useSearchParams } from 'react-router-dom'

import { BarCenter } from 'cozy-bar'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import { useAlternativeStore } from 'ducks/AlternativeStore/useAlternativeStore'

export class MyApplications extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
  }

  onAppClick(appSlug) {
    const { searchParams } = this.props

    const search = searchParams.size > 0 ? `?${searchParams.toString()}` : ''
    this.props.navigate(`/myapps/${appSlug}${search}`)
  }

  render() {
    const {
      t,
      installedApps,
      isFetching,
      isAppFetching,
      fetchError,
      actionError,
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
              parent="myapps"
            />
          )}
        </div>

        <ApplicationRouting
          installedApps={installedApps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          actionError={actionError}
          parent="myapps"
        />
      </Content>
    )
  }
}

const MyApplicationsWrapper = props => {
  const isExact = useMatch('myapps')
  const navigate = useNavigateNoUpdates()
  const [searchParams] = useSearchParams()
  const { alternativeApps } = useAlternativeStore()
  const installedAltApps = alternativeApps.filter(app => app.installed)

  return (
    <MyApplications
      {...props}
      installedApps={[...props.installedApps, ...installedAltApps]}
      isExact={isExact}
      navigate={navigate}
      searchParams={searchParams}
    />
  )
}

export default translate()(
  withBreakpoints()(withRouterUtils(MyApplicationsWrapper))
)
