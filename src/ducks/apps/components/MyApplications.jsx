/* global cozy */
import React, { Component } from 'react'
import { useLocation, useMatch } from 'react-router'
import { matchPath } from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { Content } from 'cozy-ui/transpiled/react/Layout'

import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'
import Sections from 'ducks/apps/components/QuerystringSections'
import AppsLoading from 'ducks/components/AppsLoading'

const { BarCenter } = cozy.bar

export class MyApplications extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
  }

  onAppClick(appSlug) {
    this.props.history.push(`/myapps/${appSlug}`)
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

    // const { isExact } = match
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
            />
          )}
        </div>

        {/* <ApplicationRouting
          installedApps={installedApps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          actionError={actionError}
          parent="myapps"
        /> */}
      </Content>
    )
  }
}

const MyApplicationsWrapper = props => {
  const isExact = useMatch('myapps')
  const { pathname } = useLocation()

  // const isExact = matchPath(
  //   {
  //     path: '/myapps',
  //     caseSensitive: true, // Optional. Should be `true` if the static portions of the `path` should be matched in the same case.
  //     end: true // Optional. Should be `true` if this pattern should match the entire URL pathname
  //   },
  //   pathname
  // )

  // console.log({ match })
  return <MyApplications {...props} isExact={isExact} />
}

export default translate()(withBreakpoints()(MyApplicationsWrapper))
