'use strict'

const webpack = require('webpack')

module.exports = {
  devtool: '#source-map',
  externals: ['cozy'],
  module: {
    rules: [{
      test: require.resolve('cozy-bar/dist/cozy-bar.js'),
      loader: 'imports-loader?css=./cozy-bar.css'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __STACK_ASSETS__: false
    }),
    new webpack.ProvidePlugin({
      'cozy.client': 'cozy-client-js/dist/cozy-client.js',
      'cozy.bar': 'cozy-bar/dist/cozy-bar.js'
    })
  ]
}
