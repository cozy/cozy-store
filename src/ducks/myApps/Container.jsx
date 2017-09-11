import { connect } from 'react-redux'

import { fetchMyApps, uninstallApp } from './index'

import MyApplications from './components/MyApplications'

const mapStateToProps = (state, ownProps) => ({
  myApps: state.myApps.list,
  isFetching: state.myApps.isFetching,
  error: state.myApps.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMyApps: () => dispatch(fetchMyApps()),
  uninstallApp: (appSlug) => {
    return dispatch(uninstallApp(appSlug))
    .then(() => dispatch(fetchMyApps()))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApplications)
