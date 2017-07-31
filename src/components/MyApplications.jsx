import React, { Component } from 'react'

class MyApplications extends Component {
  constructor (props) {
    super(props)
    props.fetchApps()
  }

  render () {
    const { myApps, isFetching, error } = this.props
    return (
      <div>
        <h2 className='sto-content-title'>Mes Applications</h2>
        {myApps && !!myApps.length &&
          myApps.map(a => {
            return <p>{a.id}</p>
          })
        }
        {error &&
          <p>{error}</p>
        }
        {isFetching &&
          <p>Loading...</p>
        }
      </div>
    )
  }
}

export default MyApplications
