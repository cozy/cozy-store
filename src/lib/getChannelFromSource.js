const getChannelFromSource = source => {
  const registrySourcePattern = /^registry:\/\/(.*)\/(.*)/
  const matches = source && source.match(registrySourcePattern)
  if (matches && matches.length && matches.length > 2) {
    return matches[2]
  } else {
    return null
  }
}

export default getChannelFromSource
