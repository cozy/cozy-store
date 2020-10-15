import get from 'lodash/get'

export const getTranslatedManifestProperty = (app, path, t) => {
  if (!t || !app || !path) return get(app, path, '')
  return t(`apps.${app.slug}.${path}`, {
    _: get(app, path, '')
  })
}

export default {
  getTranslatedManifestProperty
}
