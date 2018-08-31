export const APP_STATUS = {
  INSTALLED: 'installed',
  MAINTENANCE: 'maintenance',
  UPDATE: 'update'
}

export const getCurrentStatus = app => {
  const { installed, maintenance, availableVersion } = app
  if (availableVersion) return APP_STATUS.UPDATE
  if (maintenance) return APP_STATUS.MAINTENANCE
  if (installed) return APP_STATUS.INSTALLED
  return null
}

export default getCurrentStatus
