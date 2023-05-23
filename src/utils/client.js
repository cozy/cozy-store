import CozyClient from 'cozy-client'

import schema from 'lib/schema'

/**
 * Returns cozy client instance
 * @returns {object} cozy client instance
 */
export const getClient = () => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)
  const protocol = window.location.protocol
  const cozyUrl = `${protocol}//${data.domain}`

  return new CozyClient({
    uri: cozyUrl,
    token: data.token,
    schema
  })
}
