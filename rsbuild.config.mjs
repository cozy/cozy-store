import { defineConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Twake Store',
  hasServices: true,
  hasIntents: true
})

export default defineConfig(config)
