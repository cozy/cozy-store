import { connect } from 'react-redux'

import { fetchApps, uninstallApp } from './index'

import MyApplications from './components/MyApplications'

const mapStateToProps = (state, ownProps) => ({
  myApps: state.myApps.list,
  isFetching: state.myApps.isFetching,
  error: state.myApps.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps()),
  uninstallApp: (appSlug) => {
    return dispatch(uninstallApp(appSlug))
    .then(() => dispatch(fetchApps()))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApplications)
