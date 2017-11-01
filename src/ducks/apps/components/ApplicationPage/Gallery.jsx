import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

export class Gallery extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentImage: null
    }
  }

  onClick (imageUrl) {
    this.setState({ currentImage: imageUrl })
  }

  onClose () {
    this.setState({ currentImage: null })
  }

  render () {
    const { t, slug, images } = this.props
    const { currentImage } = this.state
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
              <img
                className='sto-app-big-image'
                src={image}
                alt={`${slug}-image-${index + 1}`}
                onClick={() => this.onClick(image)}
              />
            )}
          </div>
        }
        {imagesParts.small && !!imagesParts.small.length &&
          <div
            className={`sto-app-small-images${imagesParts.small.length > 2 ? ' --space-around' : ''}`}
          >
            {imagesParts.small.map((image, index) =>
              <img
                className='sto-app-small-image'
                src={image}
                alt={`${slug}-image-${index + 3}`}
                onClick={() => this.onClick(image)}
              />
            )}
          </div>
        }
        {currentImage &&
          <Modal
            title={t('app_page.preview')}
            secondaryAction={() => this.onClose()}
          >
            <ModalContent>
              <img
                className='sto-app-image-preview'
                src={currentImage}
                alt='image-preview'
              />
            </ModalContent>
          </Modal>
        }
      </div>
    )
  }
}

export default translate()(Gallery)
