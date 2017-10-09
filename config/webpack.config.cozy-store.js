'use strict'

const path = require('path')

module.exports = {
  resolve: {
    alias: {
      config: path.resolve(path.resolve(__dirname, '../src'), './config')
    }
  }
}
