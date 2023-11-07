import React from 'react'

import { useClient } from 'cozy-client'
import { getFlagshipDownloadLink } from 'cozy-client/dist/models/utils'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DevicePhoneIcon from 'cozy-ui/transpiled/react/Icons/DevicePhone'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BannerForFlagshipApp = ({
  setting,
  setHasDismissedFlagshipAppBanner
}) => {
  const { t, lang } = useI18n()
  const client = useClient()

  const downloadLink = getFlagshipDownloadLink(lang)

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
