import { connect } from 'react-redux'

import { fetchApps, fetchMyApps, installApp, uninstallApp, getInstalledApps } from './index'

import MyApplicationsComponent from './components/MyApplications'
import DiscoverComponent from './components/Discover'

const mapStateToProps = (state, ownProps) => ({
  apps: state.apps.list,
  myApps: getInstalledApps(state),
  isFetching: state.apps.isFetching,
  error: state.apps.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps()),
  fetchMyApps: () => dispatch(fetchMyApps()),
  installApp: (appSlug, channel) => dispatch(installApp(appSlug, channel)),
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
