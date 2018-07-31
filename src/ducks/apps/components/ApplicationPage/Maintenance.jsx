import React from 'react'

import { translate } from 'cozy-ui/react/I18n'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'

import maintenanceIllu from 'assets/illustrations/maintenance.svg'

export const Maintenance = ({ t, slug }) => {
  const shortDesc = t(`apps.${slug}.maintenance.short_message`)
  const longDesc = t(`apps.${slug}.maintenance.long_message`)
  return (
    <div className="sto-app-maintenance">
      <div className="sto-app-maintenance-header">
        <img
          className="sto-app-maintenance-header-image"
          src={maintenanceIllu}
        />
        <h3 className="u-title-h3">{t('app_page.interrupted')}</h3>
        <p className="sto-app-maintenance-header-desc">{shortDesc}</p>
      </div>
      <div className="sto-app-maintenance-desc">
        <h3 className="u-title-h3">{t('app_page.maintenance')}</h3>
        <ReactMarkdownWrapper source={longDesc} parseEmoji />
      </div>
    </div>
  )
}

export default translate()(Maintenance)
