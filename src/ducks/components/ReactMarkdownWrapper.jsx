import React from 'react'
import ReactMarkdown from 'react-markdown'
import Emoji from 'emoji-js'

const emojiParser = new Emoji()

const parseTitles = props => {
  return React.createElement(
    `h${props.level}`,
    { className: `md-title md-title--h${props.level}` },
    props.children
  )
}

const parseLinks = props => (
  <a href={props.href} target="_blank">
    {props.children}
  </a>
)

export const reactMarkdownRendererOptions = {
  link: parseLinks,
  heading: parseTitles
}

export const ReactMarkdownWrapper = ({ source, parseEmoji, className }) => (
  <ReactMarkdown
    source={parseEmoji ? emojiParser.replace_colons(source) : source}
    renderers={reactMarkdownRendererOptions}
    className={className}
    escapeHtml={false}
  />
)

export default ReactMarkdownWrapper
