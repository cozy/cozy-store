import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import ReactMarkdownWrapper, {
  reactMarkdownRendererOptions
} from '@/ducks/components/ReactMarkdownWrapper'

describe('ReactMarkdownWrapper component', () => {
  it('should be rendered correctly', () => {
    const { getByText, getByRole } = render(
      <ReactMarkdownWrapper source="Test [linkName]() __strongName__" />
    )
    expect(getByText('Test')).toBeInTheDocument()

    const link = getByRole('link', { name: 'linkName' })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('class')).toBe('md-link')
    expect(link.getAttribute('href')).toBe('')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.getAttribute('target')).toBe('_blank')

    const strong = getByText('strongName')
    expect(strong).toBeInTheDocument()
    expect(strong.tagName).toBe('STRONG')
  })
  it('should handle correctly markdown with emojis', () => {
    const { getByRole, getByText } = render(
      <ReactMarkdownWrapper
        source={'### Heading 3\n\nThis is a `codeName` :tada:'}
        parseEmoji
      />
    )
    expect(
      getByRole('heading', { level: 3, name: 'Heading 3' })
    ).toBeInTheDocument()

    const paragraph = getByText('This is a')
    expect(paragraph).toBeInTheDocument()
    expect(paragraph.tagName).toBe('P')

    const codeName = getByText('codeName')
    expect(codeName).toBeInTheDocument()
    expect(codeName.tagName).toBe('CODE')

    const img = getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toBe('/emoji-data/img-apple-64/1f389.png')
  })
  it('should not render if no source provided', () => {
    const { container } = render(<ReactMarkdownWrapper />)
    expect(container).toMatchInlineSnapshot('<div />')
  })
  it('should have correct link renderer options', () => {
    const { getByRole } = render(
      <reactMarkdownRendererOptions.link href="#">
        <div />
      </reactMarkdownRendererOptions.link>
    )

    const link = getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('class')).toBe('md-link')
    expect(link.getAttribute('href')).toBe('#')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.getAttribute('target')).toBe('_blank')
  })
  it('should have correct heading renderer options', () => {
    const { getByRole } = render(
      <reactMarkdownRendererOptions.heading level="3">
        MyHeading
      </reactMarkdownRendererOptions.heading>
    )

    const heading = getByRole('heading', { level: 3, name: 'MyHeading' })
    expect(heading).toBeInTheDocument()
    expect(heading.getAttribute('class')).toBe('md-title md-title--h3')
  })
})
