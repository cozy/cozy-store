'use strict'

export function getAppBySlug(state, slug) {
  return state.apps.list.find(app => app.slug === slug)
}

export function getInstalledApps(state) {
  return state.apps.list.filter(app => app.installed)
}

export function getRegistryApps(state) {
  return state.apps.list.filter(app => app.isInRegistry)
}
