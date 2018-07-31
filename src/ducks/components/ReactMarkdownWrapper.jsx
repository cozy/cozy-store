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
  <a
    className="sto-link-text"
    href={props.href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {props.children}
  </a>
)

export const reactMarkdownRendererOptions = {
  link: parseLinks,
  heading: parseTitles
}

export const ReactMarkdownWrapper = ({ source, parseEmoji, className }) => {
  if (!source) return null
  return (
    <ReactMarkdown
      source={parseEmoji ? emojiParser.replace_colons(source) : source}
      renderers={reactMarkdownRendererOptions}
      className={className}
      escapeHtml={false}
    />
  )
}

export default ReactMarkdownWrapper
