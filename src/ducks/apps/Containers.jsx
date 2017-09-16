import { connect } from 'react-redux'

import { fetchApps, fetchInstalledApps, uninstallApp, getInstalledApps, getRegistryApps, installAppFromRegistry } from './index'

import MyApplicationsComponent from './components/MyApplications'
import DiscoverComponent from './components/Discover'

const mapStateToProps = (state, ownProps) => ({
  apps: getRegistryApps(state),
  installedApps: getInstalledApps(state),
  isFetching: state.apps.isFetching,
  isInstalling: state.apps.isInstalling,
  actionError: state.apps.actionError,
  fetchError: state.apps.fetchError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps()),
  fetchInstalledApps: () => dispatch(fetchInstalledApps()),
  installApp: (appSlug, channel) => dispatch(installAppFromRegistry(appSlug, channel)),
  uninstallApp: (appSlug) => dispatch(uninstallApp(appSlug))
})

export const MyApplications = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApplicationsComponent)

export const Discover = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverComponent)
