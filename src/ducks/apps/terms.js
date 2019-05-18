/* global cozy */
const TERMS_DOCTYPE = 'io.cozy.terms'

let termsIndexCache = null
async function _getOrCreateTermsIndex() {
  termsIndexCache = await cozy.client.data.defineIndex(TERMS_DOCTYPE, [
    'termsId',
    'version'
  ])
  return termsIndexCache
}

async function save(terms) {
  const { id, ...termsAttributes } = terms
  // We use : as separator for <id>:<version>
  let savedTermsDocs = null
  try {
    savedTermsDocs = await cozy.client.data.query(
      await _getOrCreateTermsIndex(),
      {
        selector: {
          termsId: id,
          version: termsAttributes.version
        },
        limit: 1
      }
    )
  } catch (e) {
    throw e
  }
  if (savedTermsDocs && savedTermsDocs.length) {
    // we just update the url if this is the same id and same version
    // but the url changed
    const savedTerms = savedTermsDocs[0]
    if (
      savedTerms.termsId == id &&
      savedTerms.version == termsAttributes.version &&
      savedTerms.url != termsAttributes.url
    ) {
      await cozy.client.data.updateAttributes(TERMS_DOCTYPE, savedTerms._id, {
        url: termsAttributes.url
      })
    }
  } else {
    const termsToSave = Object.assign({}, termsAttributes, {
      termsId: id,
      accepted: true,
      acceptedAt: new Date()
    })
    await cozy.client.data.create(TERMS_DOCTYPE, termsToSave)
  }
}

export default {
  save
}
