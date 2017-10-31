import React from 'react'

import { translate } from 'cozy-ui/react/I18n'

export const Gallery = ({t, slug, images}) => {
  if (!images) return null
  const imagesParts = images.reduce((acc, image, index) => {
    if (index < 2) {
      if (!acc.big) acc.big = []
      acc.big.push(image)
    } else if (index < 5) {
      if (!acc.small) acc.small = []
      acc.small.push(image)
    }
    return acc
  }, {})
  return (
    <div className='sto-app-images'>
      {imagesParts.big && !!imagesParts.big.length &&
        <div className='sto-app-big-images'>
          {imagesParts.big.map((image, index) =>
            <img className='sto-app-image' src={image} alt={`${slug}-image-${index + 1}`} />
          )}
        </div>
      }
      {imagesParts.small && !!imagesParts.small.length &&
        <div
          className={`sto-app-small-images${imagesParts.small.length > 2 ? ' --space-around' : ''}`}
        >
          {imagesParts.small.map((image, index) =>
            <img className='sto-app-small-image' src={image} alt={`${slug}-image-${index + 3}`} />
          )}
        </div>
      }
    </div>
  )
}

export default translate()(Gallery)
