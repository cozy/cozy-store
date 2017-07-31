'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index')
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js'
  },
  externals: {
    'cozy-client-js': 'cozy'
  },
  plugins: [
    new webpack.DefinePlugin({
      __TARGET__: JSON.stringify('browser')
    })
  ]
}
