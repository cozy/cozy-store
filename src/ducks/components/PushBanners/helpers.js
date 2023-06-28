import BannerForAA from './BannerForAA'
import BannerForPass from './BannerForPass'

export const makePushBanner = (oAuthClients, setting) => {
  const hasAAClient = oAuthClients.some(
    oAuthClient => oAuthClient.software_id === 'amiral'
  )
  const hasPassClient = oAuthClients.some(
    oAuthClient => oAuthClient.software_id === 'io.cozy.pass.mobile'
  )

  const { hideAA = false, hidePassMobile = false } = setting.pushBanners || {
    hideAA: false,
    hidePassMobile: false
  }

  if (!hasAAClient && !hideAA) {
    return BannerForAA
  }

  if (!hasPassClient && !hidePassMobile) {
    return BannerForPass
  }

  return null
}
