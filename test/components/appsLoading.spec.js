'use strict'

/* eslint-env jest */

import { render } from '@testing-library/react'
import React from 'react'

import {
  AppsLoading,
  LoadingAppsComponents
} from '@/ducks/components/AppsLoading'

global.Math.random = () => 1 // remove random for testing

describe('AppsLoading component', () => {
  it('should be rendered correctly and never be updated', () => {
    const spy = jest.spyOn(AppsLoading.prototype, 'shouldComponentUpdate')
    render(<AppsLoading />)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('LoadingAppsComponents component', () => {
  it('should be rendered correctly if isMobile', () => {
    const { asFragment } = render(
      <LoadingAppsComponents
        count={3}
        subKey="mock"
        breakpoints={{ isMobile: true }}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
