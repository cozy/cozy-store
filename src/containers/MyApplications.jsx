import { connect } from 'react-redux'

import { fetchApps } from '../ducks/apps'

import MyApplications from '../components/MyApplications'

const mapStateToProps = (state, ownProps) => ({
  myApps: state.myApps.list,
  isFetching: state.myApps.isFetching,
  error: state.myApps.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => {
    dispatch(fetchApps())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApplications)
