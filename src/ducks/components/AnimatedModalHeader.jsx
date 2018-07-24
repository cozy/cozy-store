import React from 'react'
import { AnimatedContentHeader } from 'cozy-ui/react/Modal'
import { Placeholder } from 'ducks/components/AppsLoading'
import Icon from 'cozy-ui/react/Icon'

import CozyCircle from 'assets/icons/cozy-blue-circle.svg'
import defaultAppIcon from 'assets/icons/icon-cube.svg'

// We have to use it as a classical function since the
// Modal from cozy-ui needs to explicitely find the
// AnimatedContentHeader in the direct children
// Using a component will hide the AnimatedContentHeader
// in the component children and the Modal from cozy-ui
// won't be able to find it
export const AnimatedModalHeader = ({ app }) => (
  <AnimatedContentHeader
    className="sto-animated-header"
    activeClassName="sto-animated-header--active"
  >
    {app.iconToLoad ? (
      <div className="sto-animated-header-icon">
        <Placeholder width="3.5rem" height="3.5rem" />
      </div>
    ) : app.icon ? (
      <img
        src={app.icon}
        alt={`${app.slug}-icon`}
        width="56"
        height="56"
        className="sto-animated-header-icon"
      />
    ) : (
      <Icon
        className="sto-animated-header-icon blurry"
        width="48"
        height="64"
        icon={defaultAppIcon}
        color="#95999D"
      />
    )}
    <Icon
      icon="exchange"
      color="#95999D"
      className="sto-animated-header-exchange"
    />
    <Icon
      icon={CozyCircle}
      className="sto-animated-header-icon"
      width="56"
      height="56"
    />
  </AnimatedContentHeader>
)

export default AnimatedModalHeader
