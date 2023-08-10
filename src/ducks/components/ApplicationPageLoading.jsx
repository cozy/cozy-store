import Placeholder from 'ducks/components/Placeholder'
import React, { Component } from 'react'

export class ApplicationPageLoading extends Component {
  shouldComponentUpdate() {
    return false // always render this view only once
  }

  render() {
    return (
      <div className="sto-modal-page-app app-page-loading --loading">
        <div className="sto-app">
          <Placeholder width="9rem" className="text-placeholder" />
          <a className="sto-app-back" href="#/discover/discover" />
          <div className="sto-app-header">
            <div className="sto-app-header-icon">
              <Placeholder width="8rem" height="7rem" />
            </div>
            <div className="sto-app-header-content grp-placeholder">
              <h2 className="sto-app-header-title">
                <Placeholder width="12rem" className="text-placeholder" />
              </h2>
              <Placeholder width="40rem" className="text-placeholder" />
              <Placeholder width="30rem" className="text-placeholder" />
              <Placeholder width="18rem" className="text-placeholder" />
            </div>
          </div>
          <div className="sto-app-images">
            <div className="sto-app-big-images">
              <Placeholder width="100%" height="100%" />
              <Placeholder width="100%" height="100%" />
            </div>
            <div className="sto-app-small-images">
              <Placeholder width="100%" height="6vw" />
              <Placeholder width="100%" height="6vw" />
              <Placeholder width="100%" height="6vw" />
            </div>
          </div>
          <div className="sto-app-details">
            <div className="sto-app-descriptions">
              <div className="sto-app-description">
                <div>
                  <p className="grp-placeholder">
                    <Placeholder width="15rem" className="text-placeholder" />
                    <Placeholder width="100%" className="text-placeholder" />
                    <Placeholder width="100%" className="text-placeholder" />
                    <Placeholder width="100%" className="text-placeholder" />
                    <Placeholder width="100%" className="text-placeholder" />
                    <Placeholder width="100%" className="text-placeholder" />
                    <Placeholder width="60%" className="text-placeholder" />
                  </p>
                </div>
              </div>
            </div>
            <div className="sto-app-additional-details grp-placeholder">
              <Placeholder width="10rem" className="text-placeholder" />
              <Placeholder width="16rem" className="text-placeholder" />
              <Placeholder width="20rem" className="text-placeholder" />
              <Placeholder width="15rem" className="text-placeholder" />
              <Placeholder width="18rem" className="text-placeholder" />
              <Placeholder width="13rem" className="text-placeholder" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ApplicationPageLoading
