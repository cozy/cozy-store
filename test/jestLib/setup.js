/* istanbul ignore file */
require('babel-polyfill')

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const React = require('react')

// polyfill for requestAnimationFrame
global.requestAnimationFrame = cb => {
  setTimeout(cb, 0)
}

global.cozy = {
  bar: {
    // eslint-disable-next-line react/display-name
    BarCenter: ({ children }) => <div>{children}</div>
  }
}
