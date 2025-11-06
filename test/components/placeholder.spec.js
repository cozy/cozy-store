'use strict'

/* eslint-env jest */

import { render } from '@testing-library/react'
import React from 'react'

import Placeholder from '@/ducks/components/Placeholder'

global.Math.random = () => 1 // remove random for testing

describe('Placeholder component', () => {
  it('should be rendered correctly with autoMargin option', () => {
    const { getByTestId } = render(
      <Placeholder width="5rem" height="3rem" autoMargin />
    )
    const placeholderComponent = getByTestId('placeholder')

    expect(placeholderComponent.style.margin).toBe('auto')
  })

  it('should be rendered correctly with interval of widths', () => {
    const { getByTestId } = render(
      <Placeholder width={[3, 5]} height="3rem" autoMargin />
    )
    const placeholderComponent = getByTestId('placeholder')
    const placeholderComponentWidth = parseInt(
      placeholderComponent.style.width,
      10
    )

    expect(placeholderComponentWidth).toBeGreaterThanOrEqual(3)
    expect(placeholderComponentWidth).toBeLessThanOrEqual(5)
  })
})
