import Emoji from 'emoji-js'
import React from 'react'
import ReactMarkdown from 'react-markdown'

const emojiParser = new Emoji()

const renderTitles = props => {
  return React.createElement(
    `h${props.level}`,
    { className: `md-title md-title--h${props.level}` },
    props.children
  )
}

const renderLinks = props => (
  <a
    href={props.href}
    target="_blank"
    rel="noopener noreferrer"
    className="md-link"
  >
    {props.children}
  </a>
)

const renderParagraphs = props => (
  <p className="md-paragraph">{props.children}</p>
)

export const reactMarkdownRendererOptions = {
  paragraph: renderParagraphs,
  link: renderLinks,
  heading: renderTitles
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
