module.exports = {
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl', 'ts', 'tsx'],
  setupFiles: ['<rootDir>/test/jestLib/setup.js'],
  moduleDirectories: ['src', 'test', 'node_modules'],
  moduleNameMapper: {
    '^config/(.*)': '<rootDir>/src/config/$1',
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
    // identity-obj-proxy module is installed by cozy-scripts
    '.styl$': 'identity-obj-proxy',
    '^cozy-client$': 'cozy-client/dist/index'
  },
  transformIgnorePatterns: ['node_modules/(?!cozy-ui)'],
  globals: {
    __ALLOW_HTTP__: false,
    __TARGET__: 'browser',
    __SENTRY_TOKEN__: 'token',
    cozy: {}
  },
  snapshotSerializers: ['enzyme-to-json/serializer']
}
