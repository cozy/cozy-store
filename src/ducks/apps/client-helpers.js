import { APP_TYPE } from './constants'

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

/**
 * Fetch user apps or konnectors.
 * Adds type property in attributes from stack
 */
export const fetchUserApps = async (client, type) => {
  const route = type === APP_TYPE.KONNECTOR ? '/konnectors/' : '/apps/'
  const { data } = await client.stackClient.fetchJSON('GET', route)
  return data.map(x => {
    x.attributes.type = type
    return x
  })
}

export const fetchAppOrKonnector = (client, doctype, slug) => {
  // FIXME: hack to handle node type from stack for the konnectors
  const route =
    doctype === APP_TYPE.KONNECTOR || doctype === 'node' ? 'konnectors' : 'apps'
  return client.stackClient
    .fetchJSON('GET', `/${route}/${slug}`)
    .then(x => x.data)
}
