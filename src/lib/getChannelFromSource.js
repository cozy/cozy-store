import { REGISTRY_CHANNELS } from 'ducks/apps'

const VALID_CHANNELS = Object.values(REGISTRY_CHANNELS)

const getChannelFromSource = source => {
  // TODO: Throw an error if source is not defined
  const registrySourcePattern = /^registry:\/\/(.*)\/(.*)/
  const matches = source && source.match(registrySourcePattern)
  if (matches && matches.length && matches.length > 2) {
    const channel = matches[2]
    if (VALID_CHANNELS.includes(channel)) return channel
    return null
  } else {
    return null
  }
}

export default getChannelFromSource
