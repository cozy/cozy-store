import { connect } from 'react-redux'

import { fetchApps, uninstallApp } from '../ducks/myApps'

import MyApplications from '../components/MyApplications'

const mapStateToProps = (state, ownProps) => ({
  myApps: state.myApps.list,
  isFetching: state.myApps.isFetching,
  error: state.myApps.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps()),
  uninstallApp: (appSlug) => dispatch(uninstallApp(appSlug))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApplications)
