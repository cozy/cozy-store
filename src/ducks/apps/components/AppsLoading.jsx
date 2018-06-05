import React, { Component } from 'react'

// subarray = sections, array of subsections
// number = number of loading items per subsection
const LOADING_SECTIONS = [[4, 4], [12, 8]]

const Placeholder = ({ width, height, withMargin }) => {
  const widthStyle = Array.isArray(width)
    ? `${Math.random() * (width[1] - width[0]) + width[0]}rem`
    : width
  const style = {
    width: widthStyle,
    height
  }
  if (withMargin) style.margin = '.1rem 0'
  return <div className="sto-sections-placeholder" style={style} />
}

const LoadingAppsComponents = ({ count, subKey }) => {
  let loadingApps = []
  for (let i = 1; i <= count; i++) {
    loadingApps.push(
      <div className="sto-small-app-item" key={`${subKey}-${i}`}>
        <div className="sto-small-app-item-icon">
          <Placeholder width="4rem" height="4rem" />
        </div>
        <div className="sto-small-app-item-desc">
          <div className="sto-small-app-item-text">
            <h4 className="sto-small-app-item-title">
              <Placeholder width={[4, 8]} height="1.1rem" withMargin />
            </h4>
            <p className="sto-small-app-item-detail">
              <Placeholder width={[3, 5]} height=".75rem" withMargin />
            </p>
          </div>
          <div className="sto-small-app-item-buttons">
            <Placeholder width="5rem" height="1.3rem" withMargin />
          </div>
        </div>
      </div>
    )
  }
  return <div className="sto-sections-list">{loadingApps}</div>
}

export class AppsLoading extends Component {
  shouldComponentUpdate() {
    return false // always render this view only once
  }

  render() {
    return (
      <div className="sto-sections --loading">
        {LOADING_SECTIONS.map((subsection, subIndex) => {
          return (
            <div className="sto-sections-section" key={subIndex}>
              <h2 className="sto-sections-title">
                <Placeholder width={[8, 12]} height="1.75rem" />
              </h2>
              {subsection.map((subsectionCount, i) => {
                return (
                  <div className="sto-sections-apps" key={`${subIndex}-${i}`}>
                    <h3 className="sto-sections-subtitle">
                      <Placeholder width={[4, 6]} height="1.25rem" />
                    </h3>
                    <LoadingAppsComponents
                      count={subsectionCount}
                      subKey={`${subIndex}-${i}`}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default AppsLoading
