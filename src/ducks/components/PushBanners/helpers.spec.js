import { makePushBanner } from './helpers'

jest.mock('./BannerForAA', () => 'BannerForAA')
jest.mock('./BannerForPass', () => 'BannerForPass')

describe('makePushBanner', () => {
  describe('should return the banner for AA', () => {
    it('when no oAuth client installed for AA and Pass mobile and switches not set in database', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {})

      expect(res).toBe('BannerForAA')
    })

    it('when no oAuth client installed for AA and Pass mobile and AA banner not dismissed', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {
        pushBanners: {
          hideAA: false,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForAA')
    })

    it('when no oAuth client installed for AA even if there is one for Pass mobile', () => {
      const res = makePushBanner([{ software_id: 'io.cozy.pass.mobile' }], {
        pushBanners: {
          hideAA: false,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForAA')
    })
  })

  describe('should return the banner for Pass', () => {
    it('when oAuth client installed for AA but not for Pass mobile and switches not set in database', () => {
      const res = makePushBanner([{ software_id: 'amiral' }], {})

      expect(res).toBe('BannerForPass')
    })

    it('when oAuth client installed for AA but not for Pass mobile', () => {
      const res = makePushBanner([{ software_id: 'amiral' }], {
        pushBanners: {
          hideAA: false,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForPass')
    })

    it('when no oAuth client installed for AA but banner already dismissed', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {
        pushBanners: {
          hideAA: true,
          hidePassMobile: false
        }
      })

      expect(res).toBe('BannerForPass')
    })
  })

  describe('should return no banner', () => {
    it('when oAuth client installed for AA and Pass', () => {
      const res = makePushBanner(
        [{ software_id: 'amiral' }, { software_id: 'io.cozy.pass.mobile' }],
        {
          pushBanners: {
            hideAA: false,
            hidePassMobile: false
          }
        }
      )

      expect(res).toBeNull()
    })

    it('when oAuth client installed for AA but Pass banner already dismissed', () => {
      const res = makePushBanner([{ software_id: 'amiral' }], {
        pushBanners: {
          hideAA: false,
          hidePassMobile: true
        }
      })

      expect(res).toBeNull()
    })

    it('when no oAuth client installed for AA but AA banner and Pass banner already dismissed', () => {
      const res = makePushBanner([{ software_id: 'other_client' }], {
        pushBanners: {
          hideAA: true,
          hidePassMobile: true
        }
      })

      expect(res).toBeNull()
    })
  })
})
