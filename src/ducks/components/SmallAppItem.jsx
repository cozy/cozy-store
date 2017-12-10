import React from 'react'

import Icon from 'cozy-ui/react/Icon'
import defaultAppIcon from '../../assets/icons/icon-cube.svg'

const SmallAppItem = ({
  slug,
  developer,
  editor,
  icon,
  name,
  version,
  installed,
  onClick
}) => {
  const appVersion =
    version &&
    (version.match(/^(.*)-.*$/) ? version.match(/^(.*)-.*$/)[1] : version)
  return (
    // HACK a11y
    // `onKeyDown={(e) => e.keyCode === 13 ? onClick() : null`
    // This syntax make the div accessible.
    <div
      className='sto-small-app-item'
      onKeyDown={e => (e.keyCode === 13 ? onClick() : null)}
      onClick={onClick}
      tabIndex={0}
    >
      {icon ? (
        <img
          src={icon}
          alt={`${slug}-icon`}
          width='64'
          height='64'
          className='sto-small-app-item-icon'
        />
      ) : (
        <svg
          className='sto-small-app-item-icon--default blurry'
          width='48'
          height='64'
          style='padding: 0 8px'
        >
          <use xlinkHref={`#${defaultAppIcon.id}`} />
        </svg>
      )}
      {installed && (
        <Icon
          className='sto-small-app-item-badge-installed'
          icon='check'
          color='#2bba40'
        />
      )}
      <div className='sto-small-app-item-desc'>
        <h4 className='sto-small-app-item-title'>
          {editor && `${editor} `}
          {name}
        </h4>
        <p className='sto-small-app-item-detail'>
          {developer.name === 'Cozy' ? 'Cozy Cloud Inc.' : developer.name}
        </p>
        <p className='sto-small-app-item-detail'>
          {appVersion && `Version ${appVersion}`}
        </p>
      </div>
    </div>
  )
}

export default SmallAppItem
