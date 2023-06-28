import React from 'react'

import { useClient } from 'cozy-client'
import { isMobile, isIOS } from 'cozy-device-helper'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Button from 'cozy-ui/transpiled/react/Buttons'
import DevicePhoneIcon from 'cozy-ui/transpiled/react/Icons/DevicePhone'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const BannerForFlagshipApp = ({
  setting,
  setHasDismissedFlagshipAppBanner
}) => {
  const { t, lang } = useI18n()
  const client = useClient()

  const downloadLink = !isMobile()
    ? `https://cozy.io/${lang}/download`
    : isIOS()
    ? `https://apps.apple.com/${lang}/app/my-cozy/id1600636174`
    : `https://play.google.com/store/apps/details?id=io.cozy.flagship.mobile&hl=${lang}`

  const handleClick = () => {
    setHasDismissedFlagshipAppBanner(true)
    client.save({
      ...setting,
      _id: 'io.cozy.settings.display',
      _type: 'io.cozy.settings',
      pushBanners: { ...setting.pushBanners, hideFlagshipApp: true }
    })
  }

  return (
    <Banner
      icon={<Icon icon={DevicePhoneIcon} />}
      text={t('pushBanners.text.flagshipApp')}
      bgcolor="var(--defaultBackgroundColor)"
      inline
      buttonOne={
        <Button
          className="u-mr-1"
          variant="text"
          component="a"
          href={downloadLink}
          target="_blank"
          label={t('pushBanners.download')}
        />
      }
      buttonTwo={
        <Button
          variant="text"
          label={t('pushBanners.no-thanks')}
          onClick={handleClick}
        />
      }
    />
  )
}

export default BannerForFlagshipApp
