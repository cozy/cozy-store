import { connect } from 'react-redux'

import { fetchLastAppVersion } from './index'

import InstallModalComponent from '../components/InstallModal'
import ApplicationPageComponent from '../components/ApplicationPage'

const mapStateToProps = (state, ownProps) => ({
  currentAppVersion: state.currentAppVersion.version,
  isVersionFetching: state.currentAppVersion.isFetching,
  versionError: state.currentAppVersion.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLastAppVersion: (appSlug, channel) => dispatch(fetchLastAppVersion(appSlug, channel))
})

export const InstallModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallModalComponent)

export const ApplicationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationPageComponent)
