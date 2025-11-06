'use strict'

/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'

import { tMock } from '../../../../jestLib/I18n'

import { Gallery } from '@/ducks/apps/components/ApplicationPage/Gallery'

const getProps = () => {
  return {
    slug: 'photos',
    images: [
      'https://mockcozy.cc/registry/photos/screenshot1.png',
      'https://mockcozy.cc/registry/photos/screenshot2.png',
      'https://mockcozy.cc/registry/photos/screenshot3.png'
    ]
  }
}

describe('ApplicationPage gallery component', () => {
  it('should be rendered correctly with provided images', () => {
    const component = shallow(
      <Gallery t={tMock} {...getProps()} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with 5 images', () => {
    const props = getProps()
    props.images = props.images.concat([
      'https://mockcozy.cc/registry/photos/screenshot4.png',
      'https://mockcozy.cc/registry/photos/screenshot5.png'
    ])
    const component = shallow(<Gallery t={tMock} {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with the first 5 images if more images provided', () => {
    const props = getProps()
    props.images = props.images.concat([
      'https://mockcozy.cc/registry/photos/screenshot4.png',
      'https://mockcozy.cc/registry/photos/screenshot5.png',
      'https://mockcozy.cc/registry/photos/screenshot6.png'
    ])
    const component = shallow(<Gallery t={tMock} {...props} />)
    expect(component.find('img').length).toBe(5)
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should return null if no images provided', () => {
    const props = getProps()
    props.images = null
    const component = shallow(<Gallery t={tMock} {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle click on images (big and small)', () => {
    const props = getProps()
    const component = shallow(<Gallery t={tMock} {...props} />)
    expect(component.state().currentImage).toBe(null)
    component.find('img[alt="photos-image-1"]').simulate('click')
    expect(component.state().currentImage).toBe(props.images[0])
    component.find('img[alt="photos-image-3"]').simulate('click')
    expect(component.state().currentImage).toBe(props.images[2])
  })

  it('should handle on enter key up on images (big and small)', () => {
    const props = getProps()
    const component = shallow(<Gallery t={tMock} {...props} />)
    expect(component.state().currentImage).toBe(null)
    component
      .find('img[alt="photos-image-1"]')
      .simulate('keyUp', { keyCode: 13 })
    expect(component.state().currentImage).toBe(props.images[0])
    component
      .find('img[alt="photos-image-3"]')
      .simulate('keyUp', { keyCode: 13 })
    expect(component.state().currentImage).toBe(props.images[2])
  })

  it('should do nothing on any other key up on images (big and small)', () => {
    const props = getProps()
    const component = shallow(<Gallery t={tMock} {...props} />)
    expect(component.state().currentImage).toBe(null)
    component
      .find('img[alt="photos-image-1"]')
      .simulate('keyUp', { keyCode: 20 })
    expect(component.state().currentImage).toBe(null)
    component
      .find('img[alt="photos-image-3"]')
      .simulate('keyUp', { keyCode: 30 })
    expect(component.state().currentImage).toBe(null)
  })

  it('should open a modal on image click', () => {
    const props = getProps()
    const component = shallow(<Gallery t={tMock} {...props} />)
    expect(component.state().currentImage).toBe(null)
    component.find('img[alt="photos-image-1"]').simulate('click')
    expect(component.state().currentImage).toBe(props.images[0])
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should open a modal and handle onClose', () => {
    const props = getProps()
    const component = shallow(<Gallery t={tMock} {...props} />)
    expect(component.state().currentImage).toBe(null)
    component.find('img[alt="photos-image-1"]').simulate('click')
    expect(component.state().currentImage).toBe(props.images[0])
    component.instance().onClose()
    expect(component.state().currentImage).toBe(null)
    expect(component.getElement()).toMatchSnapshot()
  })
})
