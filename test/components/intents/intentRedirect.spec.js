'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { IntentRedirect } from 'ducks/components/intents/IntentRedirect'

Enzyme.configure({ adapter: new Adapter() })

describe('IntentRedirect component', () => {
  it('should be rendered correctly if url search provided', () => {
    const location = {
      search: '?doctype=io.cozy.apps'
    }
    const component = shallow(
      <IntentRedirect location={location} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly if search for slug', () => {
    const location = {
      search: '?slug=mock'
    }
    const component = shallow(
      <IntentRedirect location={location} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle search param without value', () => {
    const location = {
      search: '?slug=mock&doctype'
    }
    const component = shallow(
      <IntentRedirect location={location} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
