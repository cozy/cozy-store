/* global cozy */
import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppsLoading from 'ducks/components/AppsLoading'
import { useNavigateNoUpdates, withRouterUtils } from 'lib/RouterUtils'
import React, { Component } from 'react'
import { useMatch, useSearchParams } from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

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
    const { BarCenter } = cozy.bar

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

  return (
    <MyApplications
      {...props}
      isExact={isExact}
      navigate={navigate}
      searchParams={searchParams}
    />
  )
}

export default translate()(
  withBreakpoints()(withRouterUtils(MyApplicationsWrapper))
)
