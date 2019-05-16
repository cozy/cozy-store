/**
 * Fetch at most 200 apps from the channel
 *
 * Optional filter can be given
 */
export const fetchAppsFromChannel = (client, channel, filter) => {
  let filterParam = ''
  // TODO do it with URL or queryParams
  if (filter) filterParam = `&filter[type]=${filter}`
  return client.stackClient.fetchJSON(
    'GET',
    `/registry?limit=200&versionsChannel=${channel}&latestChannelVersion=${channel}${filterParam}`
  )
}

export const fetchAppOrKonnector = (client, doctype, slug) => {
  // FIXME: hack to handle node type from stack for the konnectors
  const route =
    doctype === APP_TYPE.KONNECTOR || doctype === 'node' ? 'konnectors' : 'apps'
  return client.stackClient
    .fetchJSON('GET', `/${route}/${slug}`)
    .then(x => x.data)
}
