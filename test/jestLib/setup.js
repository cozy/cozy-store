/* istanbul ignore file */
require('@babel/polyfill')

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

jest.mock('cozy-dataproxy-lib', () => ({
  DataProxyProvider: ({ children }) => children
}))

// polyfill for requestAnimationFrame
global.requestAnimationFrame = cb => {
  setTimeout(cb, 0)
}
