import BannerForFlagshipApp from './BannerForFlagshipApp'
import BannerForPass from './BannerForPass'

export const makePushBanner = (oAuthClients, setting) => {
  const hasFlagshipAppClient = oAuthClients.some(
    oAuthClient => oAuthClient.software_id === 'amiral'
  )
  const hasPassClient = oAuthClients.some(
    oAuthClient => oAuthClient.software_id === 'github.com/bitwarden/mobile'
  )

  const { hideFlagshipApp = false, hidePassMobile = false } =
    setting.pushBanners || {
      hideFlagshipApp: false,
      hidePassMobile: false
    }

  if (!hasFlagshipAppClient && !hideFlagshipApp) {
    return BannerForFlagshipApp
  }

  if (!hasPassClient && !hidePassMobile) {
    return BannerForPass
  }

  return null
}
