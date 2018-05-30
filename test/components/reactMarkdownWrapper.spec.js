'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ReactMarkdownWrapper, {
  reactMarkdownRendererOptions
} from '../../src/ducks/components/ReactMarkdownWrapper'

Enzyme.configure({ adapter: new Adapter() })

describe('ReactMarkdownWrapper component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <ReactMarkdownWrapper source="Test [link]() __strong__" />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
  it('should handle correctly markdown with emojis', () => {
    const component = shallow(
      <ReactMarkdownWrapper
        source={'### Heading 3\n\nThis is a `test` :tada:'}
        parseEmoji
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
  it('should have correct link renderer options', () => {
    const component = shallow(
      <reactMarkdownRendererOptions.link href="#">
        <div />
      </reactMarkdownRendererOptions.link>
    ).getElement()
    expect(component).toMatchSnapshot()
  })
  it('should have correct heading renderer options', () => {
    const component = shallow(
      <reactMarkdownRendererOptions.heading level="3">
        MyHeading
      </reactMarkdownRendererOptions.heading>
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
