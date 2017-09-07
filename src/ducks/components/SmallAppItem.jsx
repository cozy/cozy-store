import React from 'react'

const SmallAppItem = ({ slug, developer, editor, icon, name, version, onClick }) => {
  const appVersion = version && (version.match(/^(.*)-.*$/) ? version.match(/^(.*)-.*$/)[1] : version)
  return (
    <div className='sto-small-app-item' onClick={onClick} >
      <img src={icon} alt={`${slug}-icon`} width='64' height='64' className='sto-small-app-item-icon' />
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
