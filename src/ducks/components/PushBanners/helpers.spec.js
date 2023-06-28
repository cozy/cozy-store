import { makePushBanner } from './helpers'

jest.mock('./BannerForFlagshipApp', () => 'BannerForFlagshipApp')
jest.mock('./BannerForPass', () => 'BannerForPass')

describe('makePushBanner', () => {
  describe('should return the banner for FlagshipApp', () => {
    it('when no oAuth client installed for FlagshipApp and Pass mobile and switches not set in database', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {})

      expect(res).toBe('BannerForFlagshipApp')
    })

    it('when no oAuth client installed for FlagshipApp and Pass mobile and FlagshipApp banner not dismissed', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {
        pushBanners: {
          hideFlagshipApp: false,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForFlagshipApp')
    })

    it('when no oAuth client installed for FlagshipApp even if there is one for Pass mobile', () => {
      const res = makePushBanner([{ software_id: 'io.cozy.pass.mobile' }], {
        pushBanners: {
          hideFlagshipApp: false,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForFlagshipApp')
    })
  })

  describe('should return the banner for Pass', () => {
    it('when oAuth client installed for FlagshipApp but not for Pass mobile and switches not set in database', () => {
      const res = makePushBanner([{ software_id: 'amiral' }], {})

      expect(res).toBe('BannerForPass')
    })

    it('when oAuth client installed for FlagshipApp but not for Pass mobile', () => {
      const res = makePushBanner([{ software_id: 'amiral' }], {
        pushBanners: {
          hideFlagshipApp: false,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForPass')
    })

    it('when no oAuth client installed for FlagshipApp but FlagshipApp banner already dismissed', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {
        pushBanners: {
          hideFlagshipApp: true,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForPass')
    })
  })

  describe('should return no banner', () => {
    it('when oAuth client installed for FlagshipApp and Pass', () => {
      const res = makePushBanner(
        [{ software_id: 'amiral' }, { software_id: 'io.cozy.pass.mobile' }],
        {
          pushBanners: {
            hideFlagshipApp: false,
            hidePassMobile: false
          }
        }
      )

      expect(res).toBeNull()
    })

    it('when oAuth client installed for FlagshipApp but Pass banner already dismissed', () => {
      const res = makePushBanner([{ software_id: 'amiral' }], {
        pushBanners: {
          hideFlagshipApp: false,
          hidePassMobile: true
        }
      })

      expect(res).toBeNull()
    })

    it('when oAuth client installed for Pass and FlagshipApp banner already dismissed', () => {
      const res = makePushBanner([{ software_id: 'io.cozy.pass.mobile' }], {
        pushBanners: {
          hideFlagshipApp: true,
          hidePassMobile: false
        }
      })

      expect(res).toBeNull()
    })

    it('when no oAuth client installed for FlagshipApp but FlagshipApp banner and Pass banner already dismissed', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {
        pushBanners: {
          hideFlagshipApp: true,
          hidePassMobile: true
        }
      })

      expect(res).toBeNull()
    })
  })
})
