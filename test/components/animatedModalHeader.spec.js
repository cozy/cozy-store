'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AnimatedModalHeader from 'ducks/components/AnimatedModalHeader'

Enzyme.configure({ adapter: new Adapter() })

describe('AnimatedModalHeader component', () => {
  it('should be rendered correctly if icon', () => {
    const app = { slug: 'collect', icon: 'icon.svg' }
    const component = shallow(<AnimatedModalHeader app={app} />).getElement()
    expect(component).toMatchSnapshot()
  })
  it('should handle correctly if icon is loading', () => {
    const app = { slug: 'collect', iconToLoad: true }
    const component = shallow(<AnimatedModalHeader app={app} />).getElement()
    expect(component).toMatchSnapshot()
  })
  it('should return default icon if no app icon provided', () => {
    const app = { slug: 'collect' }
    const component = shallow(<AnimatedModalHeader app={app} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
