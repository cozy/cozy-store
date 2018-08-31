import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { translate } from 'cozy-ui/react/I18n'

import {
  fetchLatestApp,
  uninstallApp,
  getInstalledApps,
  getRegistryApps,
  installAppFromRegistry
} from './index'

import DiscoverComponent from './components/Discover'
import MyApplicationsComponent from './components/MyApplications'
import SidebarCategoriesComponent from './components/SidebarCategories'

const mapStateToProps = state => ({
  apps: getRegistryApps(state),
  installedApps: getInstalledApps(state),
  isFetching: state.apps.isFetching,
  isAppFetching: state.apps.isAppFetching,
  isInstalling: state.apps.isInstalling,
  isUninstalling: state.apps.isUninstalling,
  actionError: state.apps.actionError,
  fetchError: state.apps.fetchError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  installApp: (appSlug, appType, channel) =>
    dispatch(installAppFromRegistry(appSlug, appType, channel)),
  uninstallApp: (appSlug, appType) => dispatch(uninstallApp(appSlug, appType)),
  updateApp: (appSlug, appType, channel, permissionsAcked) =>
    dispatch(
      installAppFromRegistry(appSlug, appType, channel, true, permissionsAcked)
    ),
  fetchLatestApp: (slug, channel) =>
    dispatch(fetchLatestApp(ownProps.lang, slug, channel))
})

export const Discover = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DiscoverComponent)
)

export const MyApplications = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyApplicationsComponent)
)

export const SidebarCategories = withRouter(
  connect(
    state => ({
      apps: getRegistryApps(state),
      installedApps: getInstalledApps(state)
    }),
    null
  )(SidebarCategoriesComponent)
)
