'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import ReactMarkdownWrapper, { reactMarkdownRendererOptions } from '../../src/ducks/components/ReactMarkdownWrapper'

describe('ReactMarkdownWrapper component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <ReactMarkdownWrapper source='Test [link]() __strong__' />
    ).node
    expect(component).toMatchSnapshot()
  })
  it('should have correct Link renderer options', () => {
    const component = shallow(
      <reactMarkdownRendererOptions.Link href='#' children={<div />} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
