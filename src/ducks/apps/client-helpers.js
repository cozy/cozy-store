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
