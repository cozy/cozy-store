import fetch from 'node-fetch'
import CozyClient from 'cozy-client'
import log from 'cozy-logger'

global.fetch = fetch

const schema = {
  suggestion: {
    doctype: 'io.cozy.suggestions'
  },
  konnectors: {
    doctype: 'io.cozy.konnectors'
  }
}

function getSuggestion() {
  try {
    return JSON.parse(process.env.COZY_COUCH_DOC)
  } catch (e) {
    throw new Error(`Wrong formatted suggestion doc: ${e}`)
  }
}

const client = new CozyClient({
  uri: process.env.COZY_URL.trim(),
  schema,
  token: process.env.COZY_CREDENTIALS.trim()
}).getStackClient()

async function main() {
  const suggestion = getSuggestion()
  if (suggestion.silenced) return // silenced, so not concerned
  const slug = suggestion.slug
  try {
    await client.fetchJSON(
      'POST',
      `/konnectors/${slug}?Source=registry://${slug}/stable`
    )
  } catch (e) {
    if (e.status === 409) return
    throw new Error(`Error when installing ${slug}: ${e}`)
  }
}

const handleError = e => {
  log('error', e)
}

try {
  main().catch(handleError)
} catch (e) {
  handleError(e)
}
