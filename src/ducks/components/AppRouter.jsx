import React from 'react'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom'

import { Discover, MyApplications } from 'ducks/apps/Containers'
import IntentRedirect from 'ducks/components/intents/IntentRedirect'
import ApplicationRouting from 'ducks/apps/components/ApplicationRouting'

import { enabledPages } from 'config'
import ApplicationPage from 'ducks/apps/components/ApplicationPage'

const componentsMap = {
  discover: Discover,
  myapps: MyApplications
}

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

export const AppRouter = ({
  apps,
  installedApps,
  isFetching,
  isAppFetching,
  isUninstalling,
  actionError
}) => {
  const defaultPart = enabledPages ? enabledPages[0] : 'discover'
  console.log('ROUTER::installedApps : ', installedApps)
  const { navigate, location } = useNavigate()

  const getAppFromMatchOrSlug = (params, slug) => {
    const appsArray = apps || installedApps || []
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
      {/* <IntentRedirect />
      </Route> */}
      {/* {enabledPages.map(name => {
        if (componentsMap[name]) {
          return (
            <Route
              key={name}
              path={`/${name}`}
              component={componentsMap[name]}
            />
          )
        }
      })} */}
      <Route path={`discover`} element={<OutletWrapper Component={Discover} />}>
        <Route
          path={`:appSlug`}
          element={
            <ApplicationPage
              parent="discover"
              isFetching={isFetching}
              getApp={getAppFromMatchOrSlug}
              redirectTo={redirectTo}
            />
          }
        />
      </Route>
      <Route key="myapps" path={`myapps/*`} element={<MyApplications />} />
      {/* {defaultPart && (
        <Route path="*" render={() => <Navigate to={`/${defaultPart}`} />} />
      )} */}
      <Route path="*" element={<Navigate replace to="discover" />} />

      {/* <ApplicationRouting
        apps={apps}
        isFetching={isFetching}
        isAppFetching={isAppFetching}
        isUninstalling={isUninstalling}
        actionError={actionError}
        parent="discover"
      /> */}
    </Routes>
  )
}
