import { connect } from 'react-redux'

import {
  fetchApps,
  fetchLatestApp,
  uninstallApp,
  getInstalledApps,
  getRegistryApps,
  installAppFromRegistry
} from './index'

import DiscoverComponent from './components/Discover'
import { translate } from 'cozy-ui/react/I18n'
import MyApplicationsComponent from './components/MyApplications'

const mapStateToProps = state => ({
  apps: getRegistryApps(state),
  installedApps: getInstalledApps(state),
  isFetching: state.apps.isFetching,
  isAppFetching: state.apps.isAppFetching,
  isInstalling: state.apps.isInstalling,
  actionError: state.apps.actionError,
  fetchError: state.apps.fetchError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps(ownProps.lang)),
  installApp: (appSlug, appType, channel) =>
    dispatch(installAppFromRegistry(appSlug, appType, channel)),
  uninstallApp: (appSlug, appType) => dispatch(uninstallApp(appSlug, appType)),
  updateApp: (appSlug, appType, channel) =>
    dispatch(installAppFromRegistry(appSlug, appType, channel, true)),
  fetchLatestApp: (slug, channel) => dispatch(fetchLatestApp(slug, channel))
})

// translate last to pass the lang property to fetchApps()
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
