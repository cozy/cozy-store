import Placeholder from '@/ducks/components/Placeholder'
import React, { Component } from 'react'

import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

// subarray = sections, array of subsections
// number = number of loading items per subsection
const LOADING_SECTIONS = [
  [5, 3, 9],
  [12, 8]
]

export const LoadingAppsComponents = ({ count, subKey, breakpoints = {} }) => {
  let loadingApps = []
  const { isMobile } = breakpoints
  const iconSize = isMobile ? '2.5rem' : '3rem'
  const widthMax = isMobile ? 5 : 8
  for (let i = 1; i <= count; i++) {
    loadingApps.push(
      <div className="sto-small-app-item" key={`${subKey}-${i}`}>
        <div className="sto-small-app-item-icon-wrapper">
          <div className="sto-small-app-item-icon">
            <Placeholder width={iconSize} height={iconSize} autoMargin />
          </div>
        </div>
        <div className="sto-small-app-item-desc">
          <h4 className="sto-small-app-item-title">
            <Placeholder
              width={[4, widthMax]}
              height={isMobile ? '.8rem' : '1.1rem'}
              autoMargin
            />
          </h4>
          <p className="sto-small-app-item-developer">
            <Placeholder width={[4, widthMax]} height=".8rem" autoMargin />
          </p>
          {!!Math.round(Math.random()) && (
            <p className="sto-small-app-item-status">
              <Placeholder
                width="4rem"
                height={isMobile ? '.6rem' : '.8rem'}
                autoMargin
              />
            </p>
          )}
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
    const { breakpoints } = this.props
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
                      breakpoints={breakpoints}
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

export default withBreakpoints()(AppsLoading)
