'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin')

const {extractor, production} = require('./webpack.vars')
const pkg = require(path.resolve(__dirname, '../package.json'))

const SRC_DIR = path.resolve(__dirname, '../src')

module.exports = {
  output: {
    filename: '[name].js'
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.json', '.css'],
    alias: {
      styles: path.resolve(SRC_DIR, './styles/'),
      components: path.resolve(SRC_DIR, './components/'),
      reducers: path.resolve(SRC_DIR, './reducers/')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre', // was preLoaders property in webpack v1
        test: /\.jsx?$/,
        loader: 'standard-loader',
        exclude: /node_modules/,
        options: {
          parser: 'babel-eslint'
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|cozy-(bar|client-js))/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: extractor.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: function () {
                  return [ require('autoprefixer')({ browsers: ['last 2 versions'] }) ]
                }
              }
            }
          ]
        })
      }
    ],
    noParse: [
      /localforage\/dist/
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.ejs'),
      title: pkg.name,
      inject: false,
      minify: {
        collapseWhitespace: true
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    extractor,
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      plugins: [
        require('css-mqpacker'),
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty')
      ].concat(
        production ? require('csswring')({preservehacks: true, removeallcomments: true}) : []
      )
    })
  ]
}
