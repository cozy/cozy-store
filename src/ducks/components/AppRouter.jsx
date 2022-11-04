import React from 'react'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { Discover, MyApplications } from 'ducks/apps/Containers'
import IntentRedirect from 'ducks/components/intents/IntentRedirect'

import { enabledPages } from 'config'
import ApplicationPage from 'ducks/apps/components/ApplicationPage'
import InstallRoute from 'ducks/apps/components/ApplicationRouting/InstallRoute'
import UninstallRoute from 'ducks/apps/components/ApplicationRouting/UninstallRoute'
import PermissionsRoute from 'ducks/apps/components/ApplicationRouting/PermissionsRoute'
import ConfigureRoute from 'ducks/apps/components/ApplicationRouting/ConfigureRoute'
import ChannelRoute from 'ducks/apps/components/ApplicationRouting/ChannelRoute'

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

const subRoutes = ({
  parent,
  isFetching,
  getAppFromMatchOrSlug,
  redirectTo,
  mainPage
}) => {
  return (
    <Route
      path={`:appSlug`}
      element={
        <OutletWrapper
          Component={() => (
            <div className="sto-modal-page-container">
              <div className="sto-modal-page" ref={mainPage}>
                <ApplicationPage
                  parent={parent}
                  isFetching={isFetching}
                  getApp={getAppFromMatchOrSlug}
                  redirectTo={redirectTo}
                  mainPageRef={mainPage}
                />
              </div>
            </div>
          )}
        />
      }
    >
      <Route
        path={`channel/:channel`}
        element={
          <ChannelRoute
            getApp={getAppFromMatchOrSlug}
            isFetching={isFetching}
            parent={parent}
            redirectTo={redirectTo}
          />
        }
      />
      <Route
        path={`install`}
        element={
          <InstallRoute
            getApp={getAppFromMatchOrSlug}
            isFetching={isFetching}
            parent={parent}
            redirectTo={redirectTo}
          />
        }
      />
      <Route
        path={`uninstall`}
        element={
          <UninstallRoute
            getApp={getAppFromMatchOrSlug}
            isFetching={isFetching}
            parent={parent}
            redirectTo={redirectTo}
          />
        }
      />
      <Route
        path={`permissions`}
        element={
          <PermissionsRoute
            getApp={getAppFromMatchOrSlug}
            isFetching={isFetching}
            parent={parent}
            redirectTo={redirectTo}
          />
        }
      />
      <Route
        path={`configure`}
        element={
          <ConfigureRoute
            getApp={getAppFromMatchOrSlug}
            isFetching={isFetching}
            parent={parent}
            redirectTo={redirectTo}
          />
        }
      />
    </Route>
  )
}

export const AppRouter = ({ apps, installedApps, isFetching }) => {
  const mainPage = React.createRef()
  const navigate = useNavigate()
  const location = useLocation()

  const getAppFromMatchOrSlug = (params, slug) => {
    const appsArray = apps || installedApps || []
    const appSlug = slug || (params && params.appSlug)
    if (!appsArray.length || !appSlug) return null
    const app = appsArray.find(app => app.slug === appSlug)
    return app
  }
  const getAppFromMatchOrSlugMyApps = (params, slug) => {
    const appsArray = installedApps || []
    const appSlug = slug || (params && params.appSlug)
    if (!appsArray.length || !appSlug) return null
    const app = appsArray.find(app => app.slug === appSlug)
    return app
  }

  const redirectTo = target => {
    navigate(target + location.search, { replace: true })
    return null
  }

  return (
    <Routes>
      <Route path="redirect" render={() => <IntentRedirect />} />
      <Route path={`discover`} element={<OutletWrapper Component={Discover} />}>
        {subRoutes({
          parent: 'discover',
          isFetching,
          getAppFromMatchOrSlug,
          redirectTo,
          mainPage
        })}
      </Route>
      <Route
        path={`myapps`}
        element={<OutletWrapper Component={MyApplications} />}
      >
        {subRoutes({
          parent: 'myapps',
          isFetching,
          getAppFromMatchOrSlug: getAppFromMatchOrSlugMyApps,
          redirectTo,
          mainPage
        })}
      </Route>
      <Route path="*" element={<Navigate replace to="myapps" />} />
    </Routes>
  )
}
