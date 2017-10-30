import React from 'react'
import ReactMarkdown from 'react-markdown'
import Emoji from 'emoji-js'

const emojiParser = new Emoji()

export const reactMarkdownRendererOptions = {
  Link: props => <a href={props.href} target='_blank'>{props.children}</a>
}

export const ReactMarkdownWrapper = ({ source, parseEmoji }) =>
  <ReactMarkdown
    source={parseEmoji ? emojiParser.replace_colons(source) : source}
    renderers={reactMarkdownRendererOptions}
  />

export default ReactMarkdownWrapper
