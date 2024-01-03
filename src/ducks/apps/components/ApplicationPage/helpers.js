import Intents from 'cozy-interapp'
import minilog from 'cozy-minilog'

const log = minilog('Header')

/**
 * @param {import('cozy-client/types/CozyClient').default} client
 * @param {object} intentData
 * @param {object} app
 */
export const handleIntent = async (client, intentData, app) => {
  const intents = new Intents({ client })
  // `intents.createService` throw an error if executed outside of an Intent iframe or if it is called without intentId.
  if (intentData) {
    try {
      const service = await intents.createService()

      if (intentData.data.terminateIfInstalled) {
        return service.terminate(app)
      }
    } catch (error) {
      log.error('Error on openConnector', error)
    }
  }

  return intents.redirect('io.cozy.accounts', {
    konnector: app.slug
  })
}
