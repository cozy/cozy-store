import ApplicationPage from 'ducks/apps/components/ApplicationPage'
import ChannelRoute from 'ducks/apps/components/ApplicationRouting/ChannelRoute'
import ConfigureRoute from 'ducks/apps/components/ApplicationRouting/ConfigureRoute'
import InstallRoute from 'ducks/apps/components/ApplicationRouting/InstallRoute'
import PermissionsRoute from 'ducks/apps/components/ApplicationRouting/PermissionsRoute'
import UninstallRoute from 'ducks/apps/components/ApplicationRouting/UninstallRoute'
import React, { Component } from 'react'
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

export class ApplicationRouting extends Component {
  mainPage = React.createRef()

  getAppFromMatchOrSlug = (params, slug) => {
    const appsArray = this.props.apps || this.props.installedApps || []
    const appSlug = slug || (params && params.appSlug)
    if (!appsArray.length || !appSlug) return null
    const app = appsArray.find(app => app.slug === appSlug)
    return app
  }

  redirectTo = target => {
    const { navigate, location } = this.props
    navigate(target + location.search, { replace: true })
    return null
  }

  render() {
    const { isFetching, parent } = this.props
    return (
      <div className="sto-modal-page" ref={this.mainPage}>
        <Routes>
          <Route
            path=":appSlug"
            element={
              <OutletWrapper
                Component={() => (
                  <ApplicationPage
                    parent={parent}
                    isFetching={isFetching}
                    getApp={this.getAppFromMatchOrSlug}
                    redirectTo={this.redirectTo}
                    mainPageRef={this.mainPage}
                  />
                )}
              />
            }
          >
            <Route
              path="channel/:channel"
              element={
                <ChannelRoute
                  getApp={this.getAppFromMatchOrSlug}
                  isFetching={isFetching}
                  parent={parent}
                  redirectTo={this.redirectTo}
                />
              }
            />
            <Route
              path="install"
              element={
                <InstallRoute
                  getApp={this.getAppFromMatchOrSlug}
                  isFetching={isFetching}
                  parent={parent}
                  redirectTo={this.redirectTo}
                />
              }
            />
            <Route
              path="uninstall"
              element={
                <UninstallRoute
                  getApp={this.getAppFromMatchOrSlug}
                  isFetching={isFetching}
                  parent={parent}
                  redirectTo={this.redirectTo}
                />
              }
            />
            <Route
              path="permissions"
              element={
                <PermissionsRoute
                  getApp={this.getAppFromMatchOrSlug}
                  isFetching={isFetching}
                  parent={parent}
                  redirectTo={this.redirectTo}
                />
              }
            />
            <Route
              path="configure"
              element={
                <ConfigureRoute
                  getApp={this.getAppFromMatchOrSlug}
                  isFetching={isFetching}
                  parent={parent}
                  redirectTo={this.redirectTo}
                />
              }
            />
          </Route>
        </Routes>
      </div>
    )
  }
}

const ApplicationRoutingWrapper = props => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <ApplicationRouting {...props} navigate={navigate} location={location} />
  )
}

export default translate()(ApplicationRoutingWrapper)
