import React from 'react'

import { translate } from 'cozy-ui/react/I18n'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'

export const Details = ({t, description, changes}) => {
  return (
    <div className='sto-app-details'>
      <div className='sto-app-descriptions'>
        <div className='sto-app-description'>
          <h3>Description</h3>
          <ReactMarkdownWrapper
            source={description}
            parseEmoji
          />
        </div>
        <div className='sto-app-changes'>
          <h3>What's new?</h3>
          <ReactMarkdownWrapper
            source={changes}
            parseEmoji
          />
        </div>
      </div>
      <div className='sto-app-informations'>
        <h3>Informations</h3>
      </div>
    </div>
  )
}

export default translate()(Details)
