import React from 'react'

import iconInstalled from '../../assets/icons/icon-check.svg'

const SmallAppItem = ({ slug, developer, editor, icon, name, version, installed, onClick }) => {
  const appVersion = version && (version.match(/^(.*)-.*$/) ? version.match(/^(.*)-.*$/)[1] : version)
  return (
    <div className='sto-small-app-item' onClick={onClick} >
      <img src={icon} alt={`${slug}-icon`} width='64' height='64' className='sto-small-app-item-icon' />
      {installed &&
        <svg className='sto-small-app-item-badge-installed'>
          <use xlinkHref={`#${iconInstalled.id}`} />
        </svg>
      }
      <div className='sto-small-app-item-desc'>
        <h4 className='sto-small-app-item-title'>
          {editor && `${editor} `}{name}
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
