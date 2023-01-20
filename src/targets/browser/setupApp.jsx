import memoize from 'lodash/memoize'

import { initTranslation } from 'cozy-ui/transpiled/react/I18n'
import flag from 'cozy-flags'

import { getClient } from 'utils/client'
import { getValues, initBar } from 'utils/bar'

/**
 * Memoize this function in its own file so that it is correctly memoized
 */
const setupApp = memoize(() => {
  const container = document.querySelector('[role=application]')
  const { lang, appName } = getValues(JSON.parse(container.dataset.cozy))
  const polyglot = initTranslation(lang, lang => require(`locales/${lang}`))
  const client = getClient()
  client.registerPlugin(flag.plugin)

  initBar({ client, container, lang, appName })

  return { container, client, lang, polyglot }
})

export default setupApp
