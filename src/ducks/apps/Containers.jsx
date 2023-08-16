import DiscoverComponent from 'ducks/apps/components/Discover'
import MyApplicationsComponent from 'ducks/apps/components/MyApplications'
import SidebarCategoriesComponent from 'ducks/apps/components/SidebarCategories'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'

import { getInstalledApps, getRegistryApps } from './index'

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

export const Discover = translate()(connect(mapStateToProps)(DiscoverComponent))

export const MyApplications = translate()(
  connect(mapStateToProps)(MyApplicationsComponent)
)

export const SidebarCategories = connect(
  state => ({
    apps: getRegistryApps(state),
    installedApps: getInstalledApps(state)
  }),
  null
)(SidebarCategoriesComponent)
