import React from 'react'
import { render } from '@testing-library/react'

import { LoadingAppsComponents } from 'ducks/components/AppsLoading'
import AppLike from '../AppLike'

global.Math.random = () => 1 // remove random for testing

describe('LoadingAppsComponents component', () => {
  it('should be rendered correctly', () => {
    const { queryAllByTestId } = render(
      <AppLike>
        <LoadingAppsComponents count={1} subKey="mock" />
      </AppLike>
    )
    expect(queryAllByTestId('Placeholder')).toHaveLength(4)
  })

  it('should be rendered correctly if isMobile', () => {
    const component = render(
      <AppLike>
        <LoadingAppsComponents
          count={1}
          subKey="mock"
          breakpoints={{ isMobile: true }}
        />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })
})
