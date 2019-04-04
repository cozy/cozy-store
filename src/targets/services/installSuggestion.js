import fetch from 'node-fetch'
import CozyClient from 'cozy-client'

global.fetch = fetch

const schema = {
  suggestion: {
    doctype: 'io.cozy.suggestions'
  },
  konnectors: {
    doctype: 'io.cozy.konnectors'
  }
}

let suggestion = {}
try {
  suggestion = JSON.parse(process.env.COZY_COUCH_DOC)
} catch (e) {
  throw new Error(`Wrong formatted suggestion doc: ${e}`)
}

const client = new CozyClient({
  uri: process.env.COZY_URL.trim(),
  schema,
  token: process.env.COZY_CREDENTIALS.trim()
}).getStackClient()

const handleError = (e, slug) => {
  if (e.status === 409) return
  throw new Error(`Error when installing ${slug}: ${e}`)
}

async function install(suggestion) {
  if (suggestion.silenced) return // silenced, so not concerned
  const slug = suggestion.slug
  try {
    await client.fetchJSON('POST', `/konnectors/${slug}`)
  } catch (e) {
    handleError(e, slug)
  }
}

install(suggestion)
