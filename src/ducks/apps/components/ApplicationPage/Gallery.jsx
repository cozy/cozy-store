import React from 'react'

import { translate } from 'cozy-ui/react/I18n'

export const Gallery = ({t, slug, images}) => {
  return (
    <div className='sto-app-images'>
      {images && !!images.length &&
        images.map((screen, index) =>
          <img className='sto-app-image' src={screen} alt={`${slug}-image-${index + 1}`} />
        )
      }
    </div>
  )
}

export default translate()(Gallery)
