import React from 'react'

import Icon from 'cozy-ui/react/Icon'
import defaultAppIcon from '../../assets/icons/icon-cube.svg'

const SmallAppItem = ({
  slug,
  developer,
  editor,
  icon,
  name,
  namePrefix,
  installed,
  onClick
}) => {
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
        <Icon
          className='sto-small-app-item-icon--default blurry'
          width='48'
          height='64'
          icon={defaultAppIcon}
          color='#95999D'
        />
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
          {namePrefix && `${namePrefix} `}
          {name}
        </h4>
        <p className='sto-small-app-item-detail'>
          {developer.name === 'Cozy' ? 'Cozy Cloud Inc.' : developer.name}
        </p>
      </div>
    </div>
  )
}

export default SmallAppItem
