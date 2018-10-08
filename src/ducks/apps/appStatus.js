export const getCurrentStatusLabel = app => {
  const { installed, maintenance } = app
  if (hasPendingUpdate(app)) return 'update'
  if (maintenance) return 'maintenance'
  if (installed) return 'installed'
  return null
}

export const hasPendingUpdate = app => {
  const { availableVersion, version } = app
  return availableVersion && availableVersion !== version
}

export const isUnderMaintenance = app => {
  return !hasPendingUpdate(app) && app.maintenance
}

/* installed here means no actions needed */
export const isInstalledAndNothingToReport = app => {
  return !hasPendingUpdate(app) && !isUnderMaintenance(app) && app.installed
}
