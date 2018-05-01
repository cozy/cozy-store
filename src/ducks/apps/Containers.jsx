import { connect } from 'react-redux'

import {
  fetchApps,
  fetchInstalledApps,
  fetchLatestApp,
  uninstallApp,
  getInstalledApps,
  getRegistryApps,
  installAppFromRegistry,
  installApp
} from './index'

import DiscoverComponent from './components/Discover'
import HiddenInstallerViewComponent from './components/HiddenInstallerView'
import MyApplicationsComponent from './components/MyApplications'

const mapStateToProps = (state, ownProps) => ({
  apps: getRegistryApps(state),
  installedApps: getInstalledApps(state),
  isFetching: state.apps.isFetching,
  isAppFetching: state.apps.isAppFetching,
  isInstalling: state.apps.isInstalling,
  actionError: state.apps.actionError,
  fetchError: state.apps.fetchError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps()),
  fetchInstalledApps: () => dispatch(fetchInstalledApps()),
  installApp: (appSlug, appType, channel) =>
    dispatch(installAppFromRegistry(appSlug, appType, channel)),
  uninstallApp: (appSlug, appType) => dispatch(uninstallApp(appSlug, appType)),
  updateApp: (appSlug, appType, channel) =>
    dispatch(installAppFromRegistry(appSlug, appType, channel, true)),
  fetchLatestApp: (slug, channel) => dispatch(fetchLatestApp(slug, channel)),
  // for the hidden installer only
  installUsingInstaller: (appSlug, appType, source, isUpdate) =>
    dispatch(installApp(appSlug, appType, source, isUpdate)).catch(() => {
      dispatch({
        type: 'SEND_LOG_FAILURE',
        alert: {
          message: `HiddenInstallerView.${
            isUpdate ? 'update' : 'install'
          }_error`,
          messageData: { slug: appSlug },
          level: 'error'
        }
      })
    })
})

export const Discover = connect(mapStateToProps, mapDispatchToProps)(
  DiscoverComponent
)

export const HiddenInstallerView = connect(mapStateToProps, mapDispatchToProps)(
  HiddenInstallerViewComponent
)

export const MyApplications = connect(mapStateToProps, mapDispatchToProps)(
  MyApplicationsComponent
)
