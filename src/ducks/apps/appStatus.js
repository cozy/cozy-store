export const getCurrentStatusLabel = app => {
  const { installed, maintenance, availableVersion } = app
  if (availableVersion) return 'update'
  if (maintenance) return 'maintenance'
  if (installed) return 'installed'
  return null
}

export const hasPendingUpdate = app => {
  if (app.availableVersion) return true
  return false
}

export const isUnderMaintenance = app => {
  if (!app.availableVersion && app.maintenance) return true
  return false
}

/* installed here means no actions needed */
export const isInstalledAndNothingToReport = app => {
  if (!app.availableVersion && !app.maintenance && app.installed) return true
  return false
}
