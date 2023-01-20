import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import Placeholder from 'ducks/components/Placeholder'

global.Math.random = () => 1 // remove random for testing

describe('Placeholder component', () => {
  it('should be rendered correctly', () => {
    const { getByTestId } = render(<Placeholder width="5rem" height="3rem" />)
    expect(getByTestId('Placeholder')).toHaveStyle(`width: 5rem; height: 3rem;`)
  })

  it('should be rendered correctly with autoMargin option', () => {
    const { getByTestId } = render(
      <Placeholder width="5rem" height="3rem" autoMargin />
    )
    expect(getByTestId('Placeholder')).toHaveStyle(
      `width: 5rem; height: 3rem; margin: auto;`
    )
  })

  it('should be rendered correctly with interval of widths', () => {
    const { getByTestId } = render(
      <Placeholder width={[3, 5]} height="3rem" autoMargin />
    )
    expect(getByTestId('Placeholder')).toHaveStyle(
      `width: 5rem; height: 3rem; margin: auto;`
    )
  })
})
