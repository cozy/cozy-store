import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { MyApplications, Discover } from '@/ducks/apps/Containers'
import React from 'react'
import configureStore from 'redux-mock-store'

import AppLike from '../../AppLike'

const mockStore = configureStore()

describe('Apps Containers (connected components):', () => {
  const initialState = {
    apps: {
      list: [],
      isFetching: false,
      isInstalling: false,
      actionError: null,
      fetchError: null
    }
  }

  it('MyApplications should be rendered correctly at initial store', () => {
    const store = mockStore(initialState)
    const { getByRole } = render(
      <AppLike>
        <MyApplications store={store} />
      </AppLike>
    )

    expect(getByRole('main')).toBeInTheDocument()
  })

  it('Discover should be rendered correctly at initial store', () => {
    const store = mockStore(initialState)
    const { getByRole } = render(
      <AppLike>
        <Discover store={store} />
      </AppLike>
    )

    expect(getByRole('main')).toBeInTheDocument()
  })
})
