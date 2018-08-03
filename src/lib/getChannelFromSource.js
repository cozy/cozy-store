import { REGISTRY_CHANNELS } from 'ducks/apps'

const getChannelFromSource = source => {
  const registrySourcePattern = /^registry:\/\/(.*)\/(.*)/
  const matches = source && source.match(registrySourcePattern)
  if (matches && matches.length && matches.length > 2) {
    return REGISTRY_CHANNELS.hasOwnProperty(matches[2]) ? matches[2] : null
  } else {
    return null
  }
}

export default getChannelFromSource
