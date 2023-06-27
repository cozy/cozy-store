import BannerForAA from './BannerForAA'
import BannerForPass from './BannerForPass'

export const makePushBanner = (oAuthClients, setting) => {
  const { hasAAClient, hasPassClient } = oAuthClients.reduce(
    (acc, curr) => {
      if (curr.software_id === 'io.cozy.pass.mobile') {
        acc.hasPassClient = true
      }
      if (curr.software_id === 'amiral') {
        acc.hasAAClient = true
      }

      return acc
    },
    { hasAAClient: false, hasPassClient: false }
  )

  const { hideAA = false, hidePassMobile = false } = setting.pushBanners || {
    hideAA: false,
    hidePassMobile: false
  }

  if (!hasAAClient) {
    if (!hideAA) {
      return BannerForAA
    }
    if (!hidePassMobile) {
      return BannerForPass
    }
  } else {
    if (!hasPassClient && !hidePassMobile) {
      return BannerForPass
    }
  }

  return null
}
