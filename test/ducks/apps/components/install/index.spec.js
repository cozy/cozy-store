'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Install } from 'ducks/apps/components/Install'
import getChannel from 'lib/getChannelFromSource'

import mockApp from '../../_mockPhotosRegistryVersion'

Enzyme.configure({ adapter: new Adapter() })

const appManifest = mockApp.manifest

const getAppProps = (installed, related, transparency = false) => {
  return {
    lang: 'en',
    app: Object.assign({}, appManifest, {
      installed,
      icon: 'https://mockcozy.cc/registry/photos/icon',
      related
    }),
    parent: '/myapps',
    location: {
      pathname: transparency
        ? 'myapps/photos/permissions/transparency'
        : 'myapps/photos/permissions'
    },
    history: {
      replace: jest.fn()
    },
    match: {
      match: !transparency,
      url: 'myapps/photos/permissions'
    }
  }
}

describe('Install component', () => {
  it('should be rendered correctly with provided app', () => {
    const props = getAppProps()
    const component = shallow(<Install {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly if this is the transparency modal', () => {
    const props = getAppProps(null, null, true)
    const component = shallow(<Install {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not break the permissions part if no permissions property found in manifest', () => {
    const props = getAppProps(null, null)
    delete props.app.permissions
    const component = shallow(<Install {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should correctly cancel and use back the correct previous channel when installing from a new registry channel', async () => {
    const props = getAppProps(null, null)
    props.channel = 'beta'
    props.fetchApp = jest.fn()
    const wrapper = shallow(<Install {...props} />)
    // fetchApp is called in the constructor
    expect(props.fetchApp.mock.calls.length).toBe(1)
    // cancel the install from new channel and use back the previous channel
    const instance = wrapper.instance()
    instance.setState = jest.fn()
    await instance.gotoParent()
    expect(props.fetchApp.mock.calls.length).toBe(2)
    // previous channel from mockApp is stable here
    expect(props.fetchApp.mock.calls[1][0]).toBe(getChannel(props.app.source))
    // should change correctly the state during the fetching
    expect(instance.setState.mock.calls.length).toBe(2)
    expect(instance.setState.mock.calls[0][0]().isCanceling).toBe(true)
    expect(instance.setState.mock.calls[1][0]().isCanceling).toBe(false)
  })

  it('should go to parent if no app provided', () => {
    const props = getAppProps(null, null)
    props.app = null
    const component = shallow(<Install {...props} />)
    expect(component.type()).toBe(null)
    // should also goToParent on update if still no app provided
    component.setProps(props)
    expect(props.history.replace.mock.calls.length).toBe(1)
    expect(props.history.replace.mock.calls[0][0]).toBe(props.parent)
  })

  it('should not gotoparent if app provided on the update', () => {
    const props = getAppProps(null, null)
    const component = shallow(<Install {...props} />)
    expect(component.type()).not.toBe(null)
    component.setProps(props) // simulate props udpate
    expect(component.type()).not.toBe(null)
    // goToParent with history.replace should not be called
    expect(props.history.replace.mock.calls.length).toBe(0)
  })

  it('should gotoparent if no app provided on the update', () => {
    const props = getAppProps(null, null)
    const appSlug = props.app.slug
    const component = shallow(<Install {...props} />)
    const propsWithoutApp = Object.assign({}, props, {
      app: null
    })
    expect(component.type()).not.toBe(null)
    component.setProps(propsWithoutApp)
    expect(component.type()).toBe(null)
    // goToParent should be called once to go to the parent view
    expect(props.history.replace.mock.calls.length).toBe(1)
    expect(props.history.replace.mock.calls[0][0]).toBe(
      `${props.parent}/${appSlug}`
    )
  })
})
