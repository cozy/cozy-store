'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { ReactMarkdownWrapper } from 'ducks/components/ReactMarkdownWrapper'

describe('ReactMarkdownWrapper component', () => {
  it('should handle correctly markdown with emojis', () => {
    const component = shallow(
      <ReactMarkdownWrapper
        source={'### Heading 3\n\nThis is a `test` :tada:'}
        parseEmoji
      />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should handle correctly title with css classes in markdown', () => {
    // <Wrapper/> -> <ReactMarkdown/> -> <Heading/>
    const component = shallow(
      <ReactMarkdownWrapper
        source={'### Heading 3\n\nThis is a `test`'}
      />
    ).dive().find('Heading').dive().node
    expect(component).toMatchSnapshot()
  })
})
