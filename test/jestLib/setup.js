/* istanbul ignore file */
require('@babel/polyfill')

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

// To avoid the errors while creating theme (since no CSS stylesheet
// defining CSS variables is injected during tests)
// Material-UI: the color provided to augmentColor(color) is invalid.
// The color object needs to have a `main` property or a `500` property.
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff',
  getInvertedCssVariableValue: () => '#000'
}))
